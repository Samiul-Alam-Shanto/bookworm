"use client";

import Image from "next/image";
import Link from "next/link";
import { User, UserPlus, UserCheck, BookOpen } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function UserCard({ user }) {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async () => await axiosSecure.post(`/users/${user._id}/follow`),
    onSuccess: (data) => {
      // Invalidate the search query so the button updates instantly
      queryClient.invalidateQueries(["communitySearch"]);
      const action = data.data.isFollowing ? "Followed" : "Unfollowed";
      toast.success(`${action} ${user.name}`);
    },
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
      {/* Avatar */}
      <Link href={`/users/${user._id}`}>
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted mb-4 border-2 border-border hover:border-primary transition">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={32} className="text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <Link
        href={`/users/${user._id}`}
        className="font-bold font-serif text-lg hover:text-primary transition mb-1"
      >
        {user.name}
      </Link>

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <BookOpen size={12} />
        <span>{user.booksRead} Books Read</span>
      </div>

      {/* Action Button */}
      <button
        onClick={() => followMutation.mutate()}
        disabled={followMutation.isPending}
        className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition ${
          user.isFollowing
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {user.isFollowing ? (
          <>
            {" "}
            <UserCheck size={16} /> Following{" "}
          </>
        ) : (
          <>
            {" "}
            <UserPlus size={16} /> Follow{" "}
          </>
        )}
      </button>
    </div>
  );
}
