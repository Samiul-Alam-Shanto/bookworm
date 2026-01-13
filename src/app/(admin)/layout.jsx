"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Book,
  Users,
  MessageSquare,
  Video,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manage Books", href: "/admin/books", icon: Book },
  { name: "Manage Genres", href: "/admin/genres", icon: Menu },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Tutorials", href: "/admin/tutorials", icon: Video },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          fixed  inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-full flex flex-col p-4">
          <div className="mb-8 px-4 py-2">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Admin Panel
            </span>
          </div>

          <nav className="space-y-1 flex-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
