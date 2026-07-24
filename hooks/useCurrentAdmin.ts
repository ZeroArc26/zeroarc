"use client";

import { useEffect, useState } from "react";

export interface CurrentAdmin {
  _id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF";
  avatar?: string;
}

export default function useCurrentAdmin() {
  const [admin, setAdmin] = useState<CurrentAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/auth/me");

        const data = await res.json();

        if (data.success) {
          setAdmin(data.admin);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  return {
    admin,
    loading,
  };
}