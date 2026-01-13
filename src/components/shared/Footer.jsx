import Link from "next/link";
import { BookOpen, Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif font-bold text-xl text-primary mb-4"
            >
              <BookOpen size={24} />
              <span>BookWorm</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Your personal sanctuary for tracking reads, discovering new
              worlds, and joining a community of book lovers.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-bold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/books" className="hover:text-primary transition">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition"
                >
                  Recommendations
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="hover:text-primary transition"
                >
                  Community Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-bold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/library" className="hover:text-primary transition">
                  My Library
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BookWorm Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Built with <Heart size={12} className="text-red-500 fill-red-500" />{" "}
            by Shanto
          </p>
        </div>
      </div>
    </footer>
  );
}
