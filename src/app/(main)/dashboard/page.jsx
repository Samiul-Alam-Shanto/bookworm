"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import BookCard from "@/components/books/BookCard";
import ReadingGoal from "@/components/charts/ReadingGoal";
import ActivityChart from "@/components/charts/ActivityChart";
import GenrePieChart from "@/components/charts/GenrePieChart";
import ActivityFeed from "@/components/shared/ActivityFeed"; // Ensure this import exists
import { ChartSkeleton, BookCardSkeleton } from "@/components/ui/Skeletons";
import { Sparkles, BookOpen, Flame } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  // 1. Fetch Recommendations
  const { data: recommendations = [], isLoading: recLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => (await axiosSecure.get("/recommendations")).data,
    enabled: !!user,
  });

  // 2. Fetch User Stats (Goal, Streak, Charts)
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => (await axiosSecure.get("/stats/user")).data,
    enabled: !!user,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl text-center md:text-start font-bold font-serif mb-1">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your reading journey in {new Date().getFullYear()}.
          </p>
        </div>
        <Link
          href="/books"
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition"
        >
          <BookOpen size={18} /> See All Books
        </Link>
      </div>

      {/*  Stats vs Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts & Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            <div className="absolute top-6 right-6 flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-3 py-1.5 rounded-full z-10">
              <Flame
                size={18}
                className={
                  statsData?.stats?.streak > 0
                    ? "fill-orange-600 animate-pulse"
                    : ""
                }
              />
              <span className="font-bold text-sm">
                {statsData?.stats?.streak || 0} Day Streak
              </span>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">
                Hello, {user?.name?.split(" ")[0]}!
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md">
                You've read <strong>{statsData?.stats?.totalPages || 0}</strong>{" "}
                pages this year.
                {statsData?.stats?.totalPages > 0
                  ? " You're making great progress!"
                  : " Start a book to see your stats grow."}
              </p>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg">
                  <span className="font-bold text-foreground">
                    {statsData?.goal?.current || 0}
                  </span>{" "}
                  Books Finished
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg">
                  <span className="font-bold text-foreground">
                    {statsData?.genres?.length || 0}
                  </span>{" "}
                  Genres Explored
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statsLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <ReadingGoal
                  current={statsData?.goal?.current || 0}
                  target={statsData?.goal?.target || 10}
                />
                <ActivityChart data={statsData?.monthly || []} />
              </>
            )}
          </div>

          {/* Genre Chart  */}
          {statsLoading ? (
            <ChartSkeleton />
          ) : (
            <GenrePieChart data={statsData?.genres || []} />
          )}
        </div>

        {/* Right Column : Activity Feed */}
        <div className="h-full">
          <ActivityFeed />
        </div>
      </div>

      {/*  Recommendations Section */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Sparkles className="text-amber-500" size={24} />
          <h2 className="text-2xl font-bold font-serif">Recommended For You</h2>
        </div>

        {recLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                reason={
                  book.genres?.[0] ? `Like ${book.genres[0]}` : "Top Rated"
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
            <h3 className="font-semibold text-lg">
              Your recommendations are generating...
            </h3>
            <p className="text-muted-foreground mt-2">
              Start adding books to your "Read" shelf to get personalized
              suggestions!
            </p>
            <Link
              href="/books"
              className="inline-block mt-4 text-primary font-medium hover:underline"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
