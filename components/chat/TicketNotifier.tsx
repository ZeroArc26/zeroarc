"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getPusherClient } from "@/lib/pusher/client";

interface TicketReplyPayload {
  ticketId: string;
  ticketNumber: string;
  text: string;
}

export default function TicketNotifier() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUserId(data.user.id);
      })
      .catch(() => {});
  }, []);

  // Catch replies that arrived while the customer wasn't on the site
  // at all (Pusher only delivers to live connections) — checked once
  // whenever they load any page.
  useEffect(() => {
    if (!userId) return;

    fetch("/api/chat/unread-tickets")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          data.tickets.forEach((t: TicketReplyPayload) => {
            toast.success(`New reply on ticket #${t.ticketNumber}`, {
              description: t.text,
              action: {
                label: "View",
                onClick: () => router.push("/account/tickets"),
              },
              duration: 8000,
            });
          });
        }
      })
      .catch(() => {});
  }, [userId, router]);

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`customer-${userId}`);

    channel.bind("ticket-reply", (payload: TicketReplyPayload) => {
      toast.success(`New reply on ticket #${payload.ticketNumber}`, {
        description: payload.text,
        action: {
          label: "View",
          onClick: () => router.push("/account/tickets"),
        },
        duration: 8000,
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`customer-${userId}`);
    };
  }, [userId, router]);

  return null;
}
