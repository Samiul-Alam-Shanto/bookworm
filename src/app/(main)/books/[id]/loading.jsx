export default function BookDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-pulse">
      <div className="max-w-5xl mx-auto">
        {/* ================= TOP SECTION ================= */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-16">
          {/* Cover + Shelf Button */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="w-full aspect-2/3 bg-gray-200 rounded-xl border border-border" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>

          {/* Book Info */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Title + Author */}
            <div>
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-3" />
              <div className="h-6 w-1/3 bg-gray-200 rounded" />
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
              <div className="h-6 w-28 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border pt-12">
          {/* Reviews List */}
          <div className="space-y-6">
            <div className="h-8 w-60 bg-gray-200 rounded mb-6" />

            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewSkeleton key={i} />
            ))}
          </div>

          {/* Review Form */}
          <div className="space-y-4">
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Review Card Skeleton ---------------- */
function ReviewSkeleton() {
  return (
    <div className="bg-card p-4 rounded-xl border border-border space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded ml-auto" />
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-3 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
    </div>
  );
}
