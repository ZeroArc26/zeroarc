"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, AlertTriangle, User, MessageCircle, Ticket, Bell } from "lucide-react";

import Dropdown from "@/components/ui/dropdown/Dropdown";
import { getPusherClient } from "@/lib/pusher/client";

interface AdminNotification {
  _id: string;
  type: "order" | "low_stock" | "customer" | "chat" | "ticket";
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<AdminNotification["type"], typeof ShoppingCart> = {
  order: ShoppingCart,
  low_stock: AlertTriangle,
  customer: User,
  chat: MessageCircle,
  ticket: Ticket,
};

function formatRelativeTime(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("admin-notifications");

    channel.bind("new-notification", (notification: AdminNotification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 20));
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-notifications");
    };
  }, []);

  async function handleClick(n: AdminNotification) {
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      fetch(`/api/admin/notifications/${n._id}/read`, { method: "PATCH" }).catch(() => {});
    }
    if (n.link) router.push(n.link);
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/admin/notifications/mark-all-read", { method: "POST" });
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  return (
    <Dropdown
      trigger={
        <div className="relative rounded-2xl border border-zinc-700 bg-zinc-900 p-3 transition hover:border-violet-500">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      }
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-violet-600 px-2 py-1 text-xs">{unreadCount}</span>
          )}
        </div>

        <div className="max-h-96 space-y-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">No notifications yet.</p>
          ) : (
            notifications.map((n) => {
              const Icon = TYPE_ICON[n.type];
              return (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-zinc-800 ${
                    !n.read ? "bg-violet-500/5" : ""
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${!n.read ? "font-bold" : "font-semibold"}`}>
                        {n.title}
                      </span>
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-zinc-400">{n.message}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="mt-4 w-full rounded-xl border border-zinc-700 py-3 transition hover:border-violet-500"
          >
            Mark all as read
          </button>
        )}
      </div>
    </Dropdown>
  );
}
