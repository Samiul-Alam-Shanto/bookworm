"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import UserCard from "@/components/community/UserCard";
import { Search, Users, Loader2 } from "lucide-react";

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["communitySearch", debouncedSearch],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?q=${debouncedSearch}`);
      return res.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold font-serif mb-4 flex items-center justify-center gap-3">
          <Users className="text-primary" size={40} />
          Community
        </h1>
        <p className="text-muted-foreground">
          Find fellow bookworms, follow their journey, and discover new books
          through their reviews.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
        />
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
          <h3 className="text-xl font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try searching for a different name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
