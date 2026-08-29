import { getStoreSettings } from "@/lib/settings";

interface BotResult {
  canAnswer: boolean;
  reply: string | null;
  quickReplies?: string[];
  shouldClose?: boolean;
}

interface Rule {
  keywords: string[];
  reply: (facts: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    codAvailable: boolean;
  }) => string;
}

/**
 * Single-word keywords (e.g. "hi") use word-boundary matching so they
 * don't accidentally fire inside unrelated words (e.g. "shipping",
 * "this" both contain "hi"). Multi-word phrases are safe as plain
 * substring checks since they're inherently specific.
 */
function matchesKeyword(text: string, keyword: string): boolean {
  if (keyword.includes(" ")) return text.includes(keyword);
  return new RegExp(`\\b${keyword}\\b`, "i").test(text);
}

const QUICK_REPLY_OPTIONS = [
  "Shipping & Delivery",
  "Returns & Exchange",
  "Track My Order",
  "Payment Methods",
  "Size Guide",
  "Something Else",
];

// Order matters when a message matches multiple rules — more specific
// rules (checked first) win over generic ones. Add new keywords/rules
// here any time — no external service, no API key, nothing to break.
// Hindi/Hinglish phrasings are included alongside English for the
// same topic — this is still plain keyword matching (not real
// translation), but covers how most Indian customers actually type.
const RULES: Rule[] = [
  {
    keywords: ["free shipping", "free delivery", "muft delivery", "mupht delivery"],
    reply: (f) =>
      `Free shipping applies on prepaid orders above ₹${f.freeShippingThreshold}. Below that, standard shipping is ₹${f.standardShippingRate}.`,
  },
  {
    keywords: ["cod", "cash on delivery", "cash on delivery hai kya"],
    reply: (f) =>
      f.codAvailable
        ? "Yes, Cash on Delivery (COD) is available at checkout for eligible pincodes!"
        : "Cash on Delivery isn't available right now — we currently accept UPI, Card, and Net Banking.",
  },
  {
    keywords: [
      "payment method",
      "payment",
      "how to pay",
      "kaise pay karu",
      "payment kaise",
      "upi",
      "netbanking",
      "net banking",
    ],
    reply: () =>
      "We accept UPI, Debit/Credit Card, Net Banking, and Cash on Delivery (where available) at checkout.",
  },
  {
    keywords: [
      "return",
      "exchange",
      "refund",
      "wapas",
      "vapas",
      "cancel order",
      "order cancel",
      "return kaise",
    ],
    reply: () =>
      "Returns and exchanges are accepted within 7 days of delivery — you can start one from your Orders page in your account.",
  },
  {
    keywords: [
      "track",
      "tracking",
      "order status",
      "where is my order",
      "where's my order",
      "order kaha",
      "mera order kaha",
      "order kaha hai",
    ],
    reply: () =>
      "You can track your order live from the Orders page in your account. If you'd like a team member to check on it personally, just share your order number here!",
  },
  {
    keywords: [
      "size chart",
      "size guide",
      "chest",
      "measurement",
      "which size",
      "what size",
      "kaunsa size",
      "size kya",
      "saiz",
    ],
    reply: () =>
      "Every product page has a 'Size Guide' link with a full chart and calculator — Regular and Oversized fits have slightly different measurements, so it's worth checking per product.",
  },
  {
    keywords: [
      "shipping",
      "delivery",
      "deliver",
      "dispatch",
      "how long",
      "how many days",
      "kab aayega",
      "kitne din",
      "delivery kab",
      "shipping kab",
    ],
    reply: (f) =>
      `Standard delivery usually takes a few business days depending on your pincode, and it's free on prepaid orders above ₹${f.freeShippingThreshold}. You can check an exact estimate for your pincode on any product page.`,
  },
];

const GREETING_KEYWORDS = [
  "hi",
  "hii",
  "hello",
  "helo",
  "hlo",
  "hey",
  "namaste",
  "namaskar",
];

const CLOSING_KEYWORDS = [
  "thank you",
  "thanks",
  "thnx",
  "tysm",
  "shukriya",
  "dhanyavad",
  "solved",
  "resolved",
  "sorted",
  "issue solved",
  "problem solved",
  "error solve",
  "solve ho gya",
  "solve ho gaya",
  "got it thanks",
];

const NOT_RESOLVED_KEYWORDS = [
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

export async function generateAutoReply(
  customerMessage: string,
  customerName?: string
): Promise<BotResult> {
  const normalized = customerMessage.toLowerCase().trim();

  // Greeting gets special handling — personalized + a quick-reply menu,
  // instead of a plain FAQ answer.
  if (GREETING_KEYWORDS.some((kw) => matchesKeyword(normalized, kw))) {
    const firstName = (customerName || "there").split(" ")[0];
    return {
      canAnswer: true,
      reply: `Hey ${firstName}! 👋 What can I help you with today? Pick an option below, or just type your question.`,
      quickReplies: QUICK_REPLY_OPTIONS,
    };
  }

  // Customer signalling their issue is resolved / saying thanks — send
  // a warm closing message and flag the conversation to be closed.
  if (CLOSING_KEYWORDS.some((kw) => matchesKeyword(normalized, kw))) {
    const firstName = (customerName || "there").split(" ")[0];
    return {
      canAnswer: true,
      reply: `You're welcome, ${firstName}! 😊 Glad that's sorted. Feel free to message us anytime if anything else comes up!`,
      shouldClose: true,
    };
  }

  // Customer says the issue still isn't fixed — offer a support
  // ticket instead of repeating an FAQ answer.
  if (NOT_RESOLVED_KEYWORDS.some((kw) => matchesKeyword(normalized, kw))) {
    return {
      canAnswer: true,
      reply:
        "Sorry that didn't fully sort things out! I'll flag this for our team — you can also raise a support ticket below so it gets tracked properly.",
      quickReplies: ["Raise Support Ticket"],
    };
  }

  const settings = await getStoreSettings();
  const facts = {
    freeShippingThreshold: settings.shipping?.freeShippingThreshold ?? 599,
    standardShippingRate: settings.shipping?.standardShippingRate ?? 0,
    codAvailable: settings.shipping?.codAvailable ?? true,
  };

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => matchesKeyword(normalized, kw))) {
      return { canAnswer: true, reply: rule.reply(facts) };
    }
  }

  // No rule matched (this also covers "Something Else") — still leaves
  // it for a human (unreadByAdmin is already incremented regardless),
  // but now lets the customer proactively raise a ticket too instead
  // of just waiting in silence.
  return {
    canAnswer: true,
    reply:
      "I'm not totally sure about that one — I've flagged it for our team to look at. If you'd like it tracked with a reference number, you can raise a support ticket below.",
    quickReplies: ["Raise Support Ticket"],
  };
}

