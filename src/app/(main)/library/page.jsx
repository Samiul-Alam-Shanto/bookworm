"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import BookCard from "@/components/books/BookCard";
import Link from "next/link";
import { Loader2, BookOpen, Clock, CheckCircle, Bookmark } from "lucide-react";

const tabs = [
  { id: "all", label: "All Books", icon: BookOpen },
  { id: "currently-reading", label: "Reading", icon: Clock },
  { id: "want-to-read", label: "Want to Read", icon: Bookmark },
  { id: "read", label: "Finished", icon: CheckCircle },
];

export default function MyLibraryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: libraryItems = [], isLoading } = useQuery({
    queryKey: ["library"],
    queryFn: async () => {
      const res = await axiosSecure.get("/library");
      return res.data;
    },
    enabled: !!user,
  });

  // Filter Logic
  const filteredItems = libraryItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2">My Library</h1>
          <p className="text-muted-foreground">
            {libraryItems.length} books in your collection
          </p>
        </div>
        <Link
          href="/books"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
        >
          Discover More
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-8 gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition whitespace-nowrap
                ${
                  isActive
                    ? "bg-card border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div key={item.book._id} className="relative group">
              {/* Reuse BookCard but pass the book object */}
              <BookCard book={item.book} />

              {item.status === "currently-reading" && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10">
                  {Math.round((item.progress / item.book.total_pages) * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
          <h2 className="text-xl font-semibold mb-2">Shelf Empty</h2>
          <p className="text-muted-foreground mb-6">
            You haven't added any books to this shelf yet.
          </p>
        </div>
      )}
    </div>
  );
}
