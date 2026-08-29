"use client";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Ticket as TicketIcon,
  Send,
  Clock,
  RotateCw,
  CheckCircle2,
  CreditCard,
  Truck,
  RefreshCw,
  MapPin,
  Ruler,
  HelpCircle,
} from "lucide-react";

import { getPusherClient } from "@/lib/pusher/client";

interface TicketReply {
  sender: "admin" | "customer";
  senderName: string;
  text: string;
  createdAt: string;
}

interface CustomerTicket {
  _id: string;
  ticketNumber: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  mainProblem: string;
  replies: TicketReply[];
}

const STATUS_CONFIG = {
  open: { label: "Open", icon: Clock, color: "bg-red-50 text-red-600 border-red-200" },
  in_progress: {
    label: "In Progress",
    icon: RotateCw,
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
};

const CATEGORY_ICONS: { match: string; icon: typeof CreditCard }[] = [
  { match: "payment", icon: CreditCard },
  { match: "shipping", icon: Truck },
  { match: "return", icon: RefreshCw },
  { match: "tracking", icon: MapPin },
  { match: "sizing", icon: Ruler },
];

function getCategoryIcon(text?: string) {
  const found = CATEGORY_ICONS.find((c) => (text || "").toLowerCase().includes(c.match));
  return found?.icon || HelpCircle;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TicketCard({ ticket }: { ticket: CustomerTicket }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState(ticket.replies);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const statusInfo = STATUS_CONFIG[ticket.status];
  const StatusIcon = statusInfo.icon;
  const categoryIconEl = useMemo(
    () => createElement(getCategoryIcon(ticket.mainProblem), { className: "h-5 w-5" }),
    [ticket.mainProblem]
  );

  const hasUnreadAdminReply =
    !expanded && replies.length > 0 && replies[replies.length - 1].sender === "admin";

  useEffect(() => {
    if (!expanded) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`ticket-${ticket._id}`);
    channel.bind("new-reply", (reply: TicketReply) => {
      setReplies((prev) => [...prev, reply]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`ticket-${ticket._id}`);
    };
  }, [expanded, ticket._id]);

  useEffect(() => {
    if (expanded) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies, expanded]);

  async function sendReply() {
    if (!replyText.trim() || sending) return;

    const body = replyText.trim();
    setReplyText("");
    setSending(true);

    try {
      const res = await fetch(`/api/chat/tickets/${ticket._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body }),
      });
      const data = await res.json();
      if (!data.success) console.error("Reply failed:", data.message);
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        hasUnreadAdminReply ? "border-violet-300 shadow-sm shadow-violet-100" : "border-zinc-200"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3.5 p-5 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          {categoryIconEl}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-black">#{ticket.ticketNumber}</p>
            {hasUnreadAdminReply && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-violet-600" />
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {ticket.mainProblem || "No details captured"}
          </p>
        </div>

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
        >
          <StatusIcon className="h-3 w-3" />
          {statusInfo.label}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-100 bg-zinc-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Your issue
            </p>
            <p className="text-xs text-zinc-400">Raised {formatDate(ticket.createdAt)}</p>
          </div>
          <p className="mb-4 rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-800">
            {ticket.mainProblem || "No details captured for this ticket."}
          </p>

          {replies.length === 0 ? (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-sm text-zinc-500">
              <Clock className="h-4 w-4 shrink-0" />
              Please wait — our team will reply here as soon as possible.
            </div>
          ) : (
            <div className="mb-4 space-y-3">
              {replies.map((r, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${r.sender === "customer" ? "items-end" : "items-start"}`}
                >
                  <span className="mb-0.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                    {r.sender === "customer" ? "You" : "ZeroArc Team"}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                      r.sender === "customer"
                        ? "bg-violet-600 text-white"
                        : "border border-zinc-200 bg-white text-zinc-800"
                    }`}
                  >
                    {r.text}
                  </div>
                  <span className="mt-0.5 px-1 text-[10px] text-zinc-400">
                    {formatTime(r.createdAt)}
                  </span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}

          {ticket.status !== "resolved" && (
            <div className="flex items-center gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Add more info for our team..."
                className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-black placeholder-zinc-400 outline-none focus:border-violet-500"
              />
              <button
                onClick={sendReply}
                disabled={sending || !replyText.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyTicketsClient() {
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat/my-tickets")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTickets(data.tickets);
      })
      .catch((err) => console.error("Failed to load tickets:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-zinc-200 bg-white py-16">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <TicketIcon className="h-6 w-6 text-zinc-400" />
        </div>
        <p className="max-w-xs text-sm text-zinc-500">
          No support tickets yet. If Live Chat can&apos;t resolve something, you can raise one right from the chat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((t) => (
        <TicketCard key={t._id} ticket={t} />
      ))}
    </div>
  );
}
