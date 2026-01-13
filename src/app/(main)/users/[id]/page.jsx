"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure, axiosPublic } from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { User, UserPlus, UserCheck, Loader2 } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import React from "react";

export default function UserProfile({ params }) {
  // Unwrap params for Next 15 safety
  const { id } = React.use(params);
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: async () => (await axiosPublic.get(`/users/${id}`)).data,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", id],
    queryFn: async () => (await axiosSecure.get(`/users/${id}/follow`)).data,
    enabled: !!currentUser,
  });

  const followMutation = useMutation({
    mutationFn: async () => await axiosSecure.post(`/users/${id}/follow`),
    onSuccess: () => queryClient.invalidateQueries(["followStatus", id]),
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!profile) return <div className="p-20 text-center">User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-background shadow-sm">
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
            />
          ) : (
            <User size={40} className="m-auto mt-6 text-muted-foreground" />
          )}
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold font-serif">{profile.name}</h1>
          <p className="text-muted-foreground">
            Joined {new Date(profile.createdAt).getFullYear()}
          </p>
        </div>

        {currentUser && currentUser.id !== id && (
          <button
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
            className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition ${
              followStatus?.isFollowing
                ? "bg-muted text-foreground border border-border hover:bg-muted/80"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {followStatus?.isFollowing ? (
              <>
                <UserCheck size={18} /> Following
              </>
            ) : (
              <>
                <UserPlus size={18} /> Follow
              </>
            )}
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold font-serif mb-6">Public Library</h2>
      {profile.library?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {profile.library.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No public books found.</p>
      )}
    </div>
  );
}
