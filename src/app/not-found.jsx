import Link from "next/link";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-6 bg-muted/30 rounded-full mb-6">
        <BookX size={64} className="text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold font-serif mb-2">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
