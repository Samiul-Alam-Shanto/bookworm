"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Loader2, User, Star } from "lucide-react";

export default function ActivityFeed() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activityFeed"],
    queryFn: async () => (await axiosSecure.get("/feed")).data,
  });

  if (isLoading)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full max-h-150 overflow-y-auto">
      <h3 className="text-lg font-bold font-serif mb-6 flex items-center gap-2">
        <User size={20} className="text-primary" /> Community Feed
      </h3>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Follow users or add books to see activity!
          </p>
        ) : (
          activities.map((act) => (
            <div
              key={act._id}
              className="flex gap-3 pb-6 border-b border-border last:border-0"
            >
              <Link href={`/users/${act.user._id}`} className="shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border border-border hover:opacity-80 transition">
                  {act.user.image ? (
                    <Image
                      src={act.user.image}
                      alt={act.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User
                      size={20}
                      className="m-auto mt-2 text-muted-foreground"
                    />
                  )}
                </div>
              </Link>

              <div className="flex-1 space-y-1">
                <div className="text-sm">
                  <Link
                    href={`/users/${act.user._id}`}
                    className="font-bold hover:underline"
                  >
                    {act.user.name}
                  </Link>
                  <span className="text-muted-foreground ml-1">
                    {act.type === "REVIEW" && `rated`}
                    {act.type === "SHELF_UPDATE" && `shelved`}
                    {act.type === "FOLLOW" && `followed a user`}
                  </span>
                  {act.type === "REVIEW" && (
                    <span className="ml-1 font-bold text-amber-500">
                      {act.meta.rating} ★
                    </span>
                  )}
                  {act.type === "SHELF_UPDATE" && (
                    <span className="ml-1 font-medium text-primary capitalize">
                      {act.meta.shelf.replace(/-/g, " ")}
                    </span>
                  )}
                </div>

                {/* SHOW COMMENT SNIPPET */}
                {act.type === "REVIEW" && act.meta.comment && (
                  <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50 italic relative">
                    <span className="absolute -top-1 left-4 w-2 h-2 bg-muted/50 rotate-45 border-t border-l border-border/50"></span>
                    "{act.meta.comment}"
                  </div>
                )}

                {act.book && (
                  <Link
                    href={`/books/${act.book._id}`}
                    className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg hover:bg-muted transition group mt-2"
                  >
                    <div className="relative w-8 h-12 rounded bg-muted shrink-0 overflow-hidden">
                      <Image
                        src={act.book.cover_image}
                        alt="cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition">
                        {act.book.title}
                      </p>
                    </div>
                  </Link>
                )}

                <p className="text-[10px] text-muted-foreground pt-1">
                  {new Date(act.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
