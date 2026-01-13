"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { BookOpen, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-serif font-bold text-xl text-primary"
        >
          <BookOpen size={24} />
          <span>BookWorm</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isLoading ? (
            <div className="w-20 h-8 bg-muted/50 rounded animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              {session.user.role === "admin" ? (
                <p className="text-sm font-medium cursor-default hover:text-primary">
                  Admin Panel
                </p>
              ) : (
                <div className="flex items-center gap-4">
                  {/* NEW LINK */}
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/library"
                    className="text-sm font-medium hover:text-primary"
                  >
                    My Library
                  </Link>
                  <Link
                    href="/tutorials"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Tutorials
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 pl-4 border-l border-border">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
