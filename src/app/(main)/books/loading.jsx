export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* ---------------- Header ---------------- */}
      <div className="mb-8">
        <div className="h-10 w-105 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-70 bg-gray-200 rounded" />
      </div>

      {/* ---------------- Search + Sort + Filter ---------------- */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="flex-1 h-12 bg-gray-200 rounded-lg" />

        {/* Sort */}
        <div className="h-12 w-45 bg-gray-200 rounded-lg" />

        {/* Filter */}
        <div className="h-12 w-30 bg-gray-200 rounded-lg" />
      </div>

      {/* ---------------- Books Grid ---------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>

      {/* ---------------- Pagination ---------------- */}
      <div className="flex justify-center gap-2 mt-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-9 bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Book Cover */}
      <div className="aspect-3/4 bg-gray-200 rounded-xl" />

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-4/5" />

      {/* Author */}
      <div className="h-3 bg-gray-200 rounded w-3/5" />

      {/* Rating + Genre */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-12 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
