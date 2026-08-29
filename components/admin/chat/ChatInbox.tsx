"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Loader2, Search, MessageCircleOff } from "lucide-react";

import { getPusherClient } from "@/lib/pusher/client";

interface Conversation {
  _id: string;
  customerName: string;
  customerEmail?: string;
  status: "open" | "closed";
  lastMessage: string;
  lastMessageAt: string;
  unreadByAdmin: number;
}

interface ChatMessage {
  _id: string;
  sender: "customer" | "admin" | "ai";
  senderName: string;
  text: string;
  createdAt: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRelativeTime(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

export default function ChatInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function loadConversations() {
    try {
      const res = await fetch("/api/admin/chat/conversations");
      const data = await res.json();
      if (data.success) setConversations(data.conversations);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("admin-chat");

    channel.bind("new-message", (payload: ChatMessage & { conversationId: string }) => {
      loadConversations();

      if (payload.conversationId === activeId) {
        setMessages((prev) =>
          prev.some((m) => m._id === payload._id) ? prev : [...prev, payload]
        );
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-chat");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.customerEmail?.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  async function openConversation(id: string) {
    setActiveId(id);
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/admin/chat/conversations/${id}/messages`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
      loadConversations();
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply() {
    if (!reply.trim() || !activeId || sending) return;

    const body = reply.trim();
    setReply("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, text: body }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
        );
        loadConversations();
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  }

  async function closeConversation() {
    if (!activeId) return;
    try {
      const res = await fetch("/api/admin/chat/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId }),
      });
      const data = await res.json();
      if (data.success) loadConversations();
    } catch (err) {
      console.error("Failed to close conversation:", err);
    }
  }

  const activeConversation = conversations.find((c) => c._id === activeId);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]" style={{ height: "72vh" }}>
      {/* Conversation list */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex h-full items-center justify-center text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-zinc-500">
              <MessageCircleOff className="h-6 w-6" />
              <p className="text-sm">
                {search ? "No matching conversations." : "No conversations yet."}
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = activeId === c._id;
              const hasUnread = c.unreadByAdmin > 0;
              return (
                <button
                  key={c._id}
                  onClick={() => openConversation(c._id)}
                  className={`flex w-full items-start gap-3 border-b border-zinc-800 p-3.5 text-left transition ${
                    isActive ? "bg-violet-500/10" : "hover:bg-zinc-800"
                  }`}
                >
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-300">
                    {getInitials(c.customerName)}
                    {c.status === "closed" && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-zinc-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm ${hasUnread ? "font-bold text-white" : "font-medium text-zinc-200"}`}
                      >
                        {c.customerName}
                      </p>
                      <span className="shrink-0 text-[10px] text-zinc-500">
                        {formatRelativeTime(c.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`line-clamp-1 text-xs ${hasUnread ? "font-semibold text-zinc-300" : "text-zinc-500"}`}
                      >
                        {c.lastMessage}
                      </p>
                      {hasUnread && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                          {c.unreadByAdmin}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {!activeId ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-zinc-500">
            <MessageCircleOff className="h-6 w-6" />
            Select a conversation to view messages.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-300">
                  {activeConversation ? getInitials(activeConversation.customerName) : ""}
                </div>
                <div>
                  <p className="font-bold text-white">{activeConversation?.customerName}</p>
                  {activeConversation?.customerEmail && (
                    <p className="text-xs text-zinc-400">{activeConversation.customerEmail}</p>
                  )}
                </div>
              </div>

              {activeConversation?.status === "open" ? (
                <button
                  onClick={closeConversation}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800"
                >
                  Close Conversation
                </button>
              ) : (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-400">
                  Closed
                </span>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center text-zinc-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m._id}
                    className={`flex flex-col ${m.sender === "admin" ? "items-end" : "items-start"}`}
                  >
                    {m.sender === "ai" && (
                      <span className="mb-0.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-violet-400">
                        AI Auto-Reply
                      </span>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        m.sender === "admin"
                          ? "rounded-br-md bg-violet-600 text-white"
                          : m.sender === "ai"
                          ? "rounded-bl-md border border-violet-500/30 bg-violet-500/10 text-zinc-100"
                          : "rounded-bl-md bg-zinc-800 text-zinc-100"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="mt-0.5 px-1 text-[10px] text-zinc-500">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-zinc-800 p-3">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type a reply..."
                className="flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
