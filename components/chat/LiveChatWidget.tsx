"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Ticket, Sparkles } from "lucide-react";

import { getPusherClient } from "@/lib/pusher/client";

interface ChatMessage {
  _id: string;
  sender: "customer" | "admin" | "ai";
  senderName: string;
  text: string;
  createdAt: string;
  quickReplies?: string[];
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function LiveChatWidget() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasUnseenReply, setHasUnseenReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/account/me")
      .then((res) => res.json())
      .then((data) => setLoggedIn(Boolean(data.success)))
      .catch(() => setLoggedIn(false))
      .finally(() => setCheckedAuth(true));
  }, []);

  async function startChat() {
    setOpen(true);
    setHasUnseenReply(false);

    setLoading(true);
    try {
      const res = await fetch("/api/chat/start", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setConversationId(data.conversationId);
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }

  useEffect(() => {
    if (!conversationId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`conversation-${conversationId}`);

    channel.bind("new-message", (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (msg.sender !== "customer" && !open) setHasUnseenReply(true);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`conversation-${conversationId}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(override?: string) {
    const outgoing = (override ?? text).trim();
    if (!outgoing || !conversationId || sending) return;

    setText("");
    setSending(true);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text: outgoing }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  if (!checkedAuth || !loggedIn) return null;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={startChat}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-xl shadow-violet-600/30"
            aria-label="Open live chat"
          >
            <MessageCircle className="h-6 w-6" />
            {hasUnseenReply && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-4.5 w-4.5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-violet-600 bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">ZeroArc Support</p>
                  <p className="text-[11px] text-violet-200">Online · Replies within minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/account/tickets"
                  title="View My Tickets"
                  className="rounded-full p-1.5 transition hover:bg-white/10"
                >
                  <Ticket className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-4">
              {loading ? (
                <div className="flex h-full items-center justify-center text-zinc-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <p className="mt-8 text-center text-sm text-zinc-400">
                  Say hello — a real person will reply shortly.
                </p>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={m._id}
                    className={`flex flex-col ${m.sender === "customer" ? "items-end" : "items-start"}`}
                  >
                    {m.sender === "ai" && (
                      <span className="mb-0.5 flex items-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                        <Sparkles className="h-2.5 w-2.5" /> AI Assistant
                      </span>
                    )}
                    {m.sender === "admin" && (
                      <span className="mb-0.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                        {m.senderName || "ZeroArc Team"}
                      </span>
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                        m.sender === "customer"
                          ? "rounded-br-md bg-violet-600 text-white"
                          : m.sender === "ai"
                          ? "rounded-bl-md border border-violet-100 bg-violet-50 text-zinc-800"
                          : "rounded-bl-md border border-zinc-100 bg-white text-zinc-800"
                      }`}
                    >
                      {m.text}
                    </div>

                    <span className="mt-0.5 px-1 text-[10px] text-zinc-400">
                      {formatTime(m.createdAt)}
                    </span>

                    {/* Quick-reply buttons — only under the most recent message */}
                    {m.sender === "ai" &&
                      idx === messages.length - 1 &&
                      m.quickReplies &&
                      m.quickReplies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.quickReplies.map((option) => (
                            <button
                              key={option}
                              onClick={() => sendMessage(option)}
                              disabled={sending}
                              className="rounded-full border border-violet-300 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-zinc-200 bg-white p-3">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm text-black placeholder-zinc-400 outline-none transition focus:border-violet-500"
              />
              <button
                onClick={() => sendMessage()}
                disabled={sending || !text.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
