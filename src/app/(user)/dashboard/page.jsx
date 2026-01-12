"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import BookCard from "@/components/books/BookCard";
import ReadingGoal from "@/components/charts/ReadingGoal";
import ActivityChart from "@/components/charts/ActivityChart"; // New
import GenrePieChart from "@/components/charts/GenrePieChart"; // New
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: recommendations = [], isLoading: recLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => (await axiosSecure.get("/recommendations")).data,
    enabled: !!user,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => (await axiosSecure.get("/stats/user")).data,
    enabled: !!user,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header & Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">
            Hello, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Here is your reading summary for 2025.
          </p>
        </div>
        <Link
          href="/library"
          className="flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <BookOpen size={18} /> Go to Library
        </Link>
      </div>

      {/*  Charts Grid */}
      {statsLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/*  Reading Goal (Circular) */}
          <ReadingGoal
            current={statsData?.goal?.current || 0}
            target={statsData?.goal?.target || 10}
          />

          {/*  Monthly Activity (Bar) */}
          <ActivityChart data={statsData?.monthly || []} />

          {/*  Genre Breakdown (Pie) */}
          <GenrePieChart data={statsData?.genres || []} />
        </div>
      )}

      {/*  Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Sparkles className="text-amber-500" size={24} />
          <h2 className="text-2xl font-bold font-serif">Recommended For You</h2>
        </div>

        {recLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl">
            <p>Read more books to unlock better recommendations!</p>
          </div>
        )}
      </div>
    </div>
  );
}
