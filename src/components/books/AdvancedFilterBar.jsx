"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter, ArrowUpDown, Star } from "lucide-react";
import { useState, useEffect, useTransition } from "react";

export default function AdvancedFilterBar({ allGenres }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const initialGenres = searchParams.get("genres")
    ? searchParams.get("genres").split(",")
    : [];
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);

  const [minRating, setMinRating] = useState(searchParams.get("rating") || "0");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  //  Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        applyFilters();
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Toggle Genre Logic (Multi-select)
  const toggleGenre = (genreName) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName];
      return newGenres;
    });
  };

  //  Apply Filters (Push to URL)
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (selectedGenres.length > 0)
      params.set("genres", selectedGenres.join(","));
    if (minRating !== "0") params.set("rating", minRating);
    if (sortBy !== "newest") params.set("sort", sortBy);

    // Always reset to page 1 on filter change
    params.set("page", "1");

    startTransition(() => {
      router.push(`/books?${params.toString()}`);
    });
  };

  useEffect(() => {
    if (
      searchParams.get("genres") !== selectedGenres.join(",") ||
      searchParams.get("rating") !== minRating ||
      searchParams.get("sort") !== sortBy
    ) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, minRating, sortBy]);

  const clearAll = () => {
    setSearch("");
    setSelectedGenres([]);
    setMinRating("0");
    setSortBy("newest");
    router.push("/books");
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Top Row: Search + Sort + Toggle Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 shadow-sm min-w-45">
          <ArrowUpDown size={16} className="text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card border-none focus:ring-0 text-sm font-medium w-full cursor-pointer outline-none"
          >
            <option value="newest">Newest Added</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="popularity_desc">Most Shelved</option>
          </select>
        </div>

        {/* Filter Toggle Button (Mobile mainly, but useful for desktop clutter) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition-colors ${
            showFilters || selectedGenres.length > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:bg-muted"
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {(selectedGenres.length > 0 || minRating !== "0") && (
            <span className="ml-1 bg-white text-primary text-xs font-bold px-1.5 rounded-full">
              !
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters Section */}
      {(showFilters || selectedGenres.length > 0) && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in slide-in-from-top-2">
          <div className="space-y-6">
            {/* Multi-Select Genres */}
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {allGenres.map((g) => {
                  const isSelected = selectedGenres.includes(g.name);
                  return (
                    <button
                      key={g._id}
                      onClick={() => toggleGenre(g.name)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Minimum Rating
              </h3>
              <div className="flex items-center gap-4">
                {[4, 3, 2, 0].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars.toString())}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${
                      minRating === stars.toString()
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {stars === 0 ? (
                      "Any"
                    ) : (
                      <>
                        <span>{stars}+</span>
                        <Star size={12} fill="currentColor" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All Link */}
            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <X size={14} /> Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
