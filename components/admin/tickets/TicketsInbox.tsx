"use client";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  ExternalLink,
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

interface Ticket {
  _id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail?: string;
  conversationId?: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

interface TicketReply {
  sender: "admin" | "customer";
  senderName: string;
  text: string;
  createdAt: string;
}

interface TicketDetail extends Ticket {
  mainProblem: string;
  transcript: {
    sender: string;
    senderName: string;
    text: string;
    createdAt: string;
  }[];
  replies: TicketReply[];
}

const STATUS_CONFIG = {
  open: { label: "Open", icon: Clock, color: "bg-red-500/10 text-red-400 border-red-500/30" },
  in_progress: {
    label: "In Progress",
    icon: RotateCw,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
};

const FILTER_TABS: { value: "all" | Ticket["status"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

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
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TicketsInbox() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [filter, setFilter] = useState<"all" | Ticket["status"]>("all");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<TicketDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadTickets() {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("admin-tickets");
    channel.bind("new-ticket", () => loadTickets());
    channel.bind("ticket-followup", () => loadTickets());
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-tickets");
    };
  }, []);

  const filteredTickets = useMemo(
    () => (filter === "all" ? tickets : tickets.filter((t) => t.status === filter)),
    [tickets, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tickets.length, open: 0, in_progress: 0, resolved: 0 };
    tickets.forEach((t) => (c[t.status] = (c[t.status] || 0) + 1));
    return c;
  }, [tickets]);

  async function openTicket(id: string) {
    setActiveId(id);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/tickets/${id}`);
      const data = await res.json();
      if (data.success) setActiveTicket(data.ticket);
    } catch (err) {
      console.error("Failed to load ticket:", err);
    } finally {
      setLoadingDetail(false);
    }
  }

  useEffect(() => {
    if (!activeId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`ticket-${activeId}`);
    channel.bind("new-reply", (reply: TicketReply) => {
      setActiveTicket((prev) => (prev ? { ...prev, replies: [...prev.replies, reply] } : prev));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`ticket-${activeId}`);
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?.replies]);

  async function updateStatus(status: Ticket["status"]) {
    if (!activeId) return;
    try {
      const res = await fetch(`/api/admin/tickets/${activeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveTicket((prev) => (prev ? { ...prev, status } : prev));
        loadTickets();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function sendReply() {
    if (!replyText.trim() || !activeId || sendingReply) return;

    const body = replyText.trim();
    setReplyText("");
    setSendingReply(true);

    try {
      const res = await fetch(`/api/admin/tickets/${activeId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveTicket((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
        loadTickets();
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSendingReply(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              filter === tab.value
                ? "border-violet-500 bg-violet-500/10 text-violet-300"
                : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            {tab.label} ({counts[tab.value] ?? 0})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]" style={{ height: "68vh" }}>
        {/* Ticket list */}
        <div className="overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          {loadingList ? (
            <div className="flex h-full items-center justify-center text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500">No tickets in this view.</p>
          ) : (
            filteredTickets.map((t) => {
              const statusInfo = STATUS_CONFIG[t.status];
              const StatusIcon = statusInfo.icon;
              return (
                <button
                  key={t._id}
                  onClick={() => openTicket(t._id)}
                  className={`flex w-full flex-col gap-1.5 border-b border-zinc-800 p-4 text-left transition ${
                    activeId === t._id ? "bg-violet-500/10" : "hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">#{t.ticketNumber}</p>
                    <span
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusInfo.color}`}
                    >
                      <StatusIcon className="h-2.5 w-2.5" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-400">{t.customerName}</p>
                    <p className="text-[10px] text-zinc-500">{formatDate(t.createdAt)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Ticket detail */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {!activeId ? (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Select a ticket to view details.
            </div>
          ) : loadingDetail || !activeTicket ? (
            <div className="flex h-full items-center justify-center text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    {createElement(getCategoryIcon(activeTicket.mainProblem), {
                      className: "h-4.5 w-4.5",
                    })}
                  </div>
                  <div>
                    <p className="font-bold text-white">#{activeTicket.ticketNumber}</p>
                    <p className="text-xs text-zinc-400">
                      {activeTicket.customerName}
                      {activeTicket.customerEmail && ` · ${activeTicket.customerEmail}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTicket.conversationId && (
                    <Link
                      href={`/admin/dashboard/chat`}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View in Live Chat
                    </Link>
                  )}

                  <select
                    value={activeTicket.status}
                    onChange={(e) => updateStatus(e.target.value as Ticket["status"])}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Admin-only context — full transcript at raise time */}
                <details className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Full chat transcript (context)
                  </summary>
                  <div className="mt-3 space-y-2">
                    {activeTicket.transcript.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-xl px-3 py-1.5 text-xs ${
                            m.sender === "customer"
                              ? "bg-violet-600 text-white"
                              : m.sender === "ai"
                              ? "border border-violet-500/30 bg-violet-500/10 text-zinc-200"
                              : "bg-zinc-800 text-zinc-200"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>

                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Customer&apos;s issue
                </p>
                <p className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100">
                  {activeTicket.mainProblem || "No details captured for this ticket."}
                </p>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Ticket replies
                </p>
                <div className="space-y-3">
                  {activeTicket.replies.length === 0 ? (
                    <p className="text-sm text-zinc-500">No replies yet — write one below.</p>
                  ) : (
                    activeTicket.replies.map((r, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${r.sender === "admin" ? "items-end" : "items-start"}`}
                      >
                        <span className="mb-0.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                          {r.sender === "admin" ? r.senderName || "You" : "Customer"}
                        </span>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                            r.sender === "admin"
                              ? "bg-violet-600 text-white"
                              : "bg-zinc-800 text-zinc-100"
                          }`}
                        >
                          {r.text}
                        </div>
                        <span className="mt-0.5 px-1 text-[10px] text-zinc-500">
                          {formatTime(r.createdAt)}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-800 p-3">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Reply to this ticket..."
                  className="flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
                />
                <button
                  onClick={sendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
