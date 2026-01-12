"use client";

import { useSession } from "next-auth/react";

export default function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    role: session?.user?.role,
    loading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
