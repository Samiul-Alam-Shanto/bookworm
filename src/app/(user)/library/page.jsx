"use client";

import useAuth from "@/hooks/useAuth";

export default function MyLibraryPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground">
          My Library
        </h1>
      </div>

      {/* Empty State for now */}
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-muted-foreground mb-6">
          Your shelves are looking a bit empty.
        </p>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
          Browse Books
        </button>
      </div>
    </div>
  );
}
