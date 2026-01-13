"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { BookOpen, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-serif font-bold text-xl text-primary"
        >
          <BookOpen size={24} />
          <span className="hidden sm:inline">BookWorm</span>
        </Link>

        <div
          className={`${
            isAdmin ? "flex" : "hidden md:flex"
          } items-center gap-4`}
        >
          <ThemeToggle />

          {isLoading ? (
            <div className="w-20 h-8 bg-muted/50 rounded animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <p className="text-sm hidden sm:block font-medium cursor-default hover:text-primary whitespace-nowrap">
                  Admin Panel
                </p>
              ) : (
                //  Navigation Links
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-primary transition"
                  >
                    Home
                  </Link>
                  <Link
                    href="/library"
                    className="text-sm font-medium hover:text-primary transition"
                  >
                    My Library
                  </Link>
                  <Link
                    href="/community"
                    className="text-sm font-medium hover:text-primary transition"
                  >
                    Community
                  </Link>
                  <Link
                    href="/tutorials"
                    className="text-sm font-medium hover:text-primary transition"
                  >
                    Tutorials
                  </Link>
                </div>
              )}

              {/* Profile & Logout Section */}
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
                    <div className="w-full h-full  bg-muted flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-2 text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
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
                className="px-4 py-2 text-sm font-medium hover:text-primary transition"
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

        <div
          className={`${
            isAdmin ? "hidden" : "flex md:hidden"
          } items-center gap-3`}
        >
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Standard Users Only) */}
      {mobileMenuOpen && !isAdmin && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {isLoading ? (
              <div className="w-full h-8 bg-muted/50 rounded animate-pulse" />
            ) : session ? (
              <>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium py-2 hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/library"
                    className="text-sm font-medium py-2 hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Library
                  </Link>
                  <Link
                    href="/community"
                    className="text-sm font-medium py-2 hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Community
                  </Link>
                  <Link
                    href="/tutorials"
                    className="text-sm font-medium py-2 hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tutorials
                  </Link>
                </div>

                <div className="pt-3 border-t border-border flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="p-2 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full px-4 py-2 text-sm font-medium text-center hover:text-primary transition border border-border rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
