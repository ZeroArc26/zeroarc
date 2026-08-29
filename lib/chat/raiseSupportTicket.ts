import Conversation from "@/models/Conversation";
import ChatMessage from "@/models/ChatMessage";
import SupportTicket from "@/models/SupportTicket";
import { pusherServer } from "@/lib/pusher/server";

function generateTicketNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `TKT-${timestamp}${random}`;
}

interface CustomerLike {
  id: string;
  fullName?: string;
  email?: string;
}

interface ChatMessageLean {
  sender: string;
  senderName: string;
  text: string;
  createdAt: Date;
}

function matchesKeyword(text: string, keyword: string): boolean {
  if (keyword.includes(" ")) return text.includes(keyword);
  return new RegExp(`\\b${keyword}\\b`, "i").test(text);
}

// Same topic groupings as the rule-based chat bot — used here to turn
// "not fixed"/"still not working" into a meaningful category (e.g.
// "Payment Issue") based on what the customer was actually asking
// about earlier in the conversation, instead of showing that literal
// unhelpful phrase to the customer on their ticket.
const CATEGORY_KEYWORDS: { label: string; keywords: string[] }[] = [
  {
    label: "Payment Issue",
    keywords: [
      "payment",
      "upi",
      "cod",
      "cash on delivery",
      "netbanking",
      "net banking",
      "how to pay",
      "kaise pay karu",
    ],
  },
  {
    label: "Shipping & Delivery Issue",
    keywords: [
      "shipping",
      "delivery",
      "deliver",
      "dispatch",
      "free shipping",
      "free delivery",
      "kab aayega",
      "kitne din",
    ],
  },
  {
    label: "Return/Exchange Issue",
    keywords: ["return", "exchange", "refund", "wapas", "vapas", "cancel order"],
  },
  {
    label: "Order Tracking Issue",
    keywords: ["track", "tracking", "order status", "where is my order", "order kaha"],
  },
  {
    label: "Sizing Issue",
    keywords: ["size", "chest", "measurement", "fit", "kaunsa size", "saiz"],
  },
];

// Phrases that only indicate frustration/escalation, not the topic
// itself — never treat these as the customer's "problem" text.
const NON_TOPIC_PHRASES = [
  "raise support ticket",
  "not resolved",
  "not fixed",
  "not working",
  "doesn't work",
  "still not",
  "nahi hua",
  "nahi hui",
  "solve nahi",
  "fix nahi",
  "abhi tak nahi",
  "still an issue",
  "still a problem",
];

function detectCategory(customerMessages: string[]): string | null {
  // Most recent first — the last topic they were actually asking
  // about is the most relevant one.
  for (const text of customerMessages) {
    const normalized = text.toLowerCase();
    for (const category of CATEGORY_KEYWORDS) {
      if (category.keywords.some((kw) => matchesKeyword(normalized, kw))) {
        return category.label;
      }
    }
  }
  return null;
}

export async function raiseSupportTicket(
  conversationId: string,
  currentUser: CustomerLike
) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId: currentUser.id,
  });

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  const messages = await ChatMessage.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean<ChatMessageLean[]>();

  const customerTexts = [...messages]
    .reverse()
    .filter((m) => m.sender === "customer")
    .map((m) => m.text);

  const category = detectCategory(customerTexts);

  // Fall back to the last customer message that isn't just a
  // frustration/escalation phrase, if no known category matched.
  const lastMeaningfulMessage = customerTexts.find(
    (text) => !NON_TOPIC_PHRASES.some((phrase) => matchesKeyword(text.toLowerCase(), phrase))
  );

  const mainProblem =
    category ||
    lastMeaningfulMessage ||
    "General inquiry — raised directly from Live Chat.";

  const ticket = await SupportTicket.create({
    ticketNumber: generateTicketNumber(),
    userId: currentUser.id,
    conversationId,
    customerName: currentUser.fullName || "Customer",
    customerEmail: currentUser.email || "",
    mainProblem,
    transcript: messages.map((m) => ({
      sender: m.sender,
      senderName: m.senderName,
      text: m.text,
      createdAt: m.createdAt,
    })),
  });

  const confirmationText = `Got it! I've raised support ticket #${ticket.ticketNumber} for you — our team will follow up on the ticket. You can reference this number anytime. Starting a new chat here will begin a fresh conversation.`;

  const confirmationMessage = await ChatMessage.create({
    conversationId,
    sender: "ai",
    senderName: "ZeroArc AI Assistant",
    text: confirmationText,
  });

  conversation.lastMessage = confirmationText;
  conversation.lastMessageAt = new Date();
  conversation.unreadByAdmin += 1;
  // A ticket has taken over from here — close this Live Chat
  // conversation so the next time the customer opens the widget they
  // get a completely fresh chat, instead of this one lingering.
  conversation.status = "closed";
  await conversation.save();

  const payload = {
    _id: confirmationMessage._id.toString(),
    sender: confirmationMessage.sender,
    senderName: confirmationMessage.senderName,
    text: confirmationMessage.text,
    createdAt: confirmationMessage.createdAt,
  };

  await pusherServer.trigger(`conversation-${conversationId}`, "new-message", payload);
  await pusherServer.trigger("admin-chat", "new-message", { conversationId, ...payload });
  await pusherServer.trigger("admin-tickets", "new-ticket", {
    ticketNumber: ticket.ticketNumber,
    customerName: ticket.customerName,
  });

  return { ticketNumber: ticket.ticketNumber, message: payload };
}
