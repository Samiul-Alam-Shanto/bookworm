export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Cover */}
      <div className="w-full aspect-2/3 bg-muted rounded-lg mb-3" />
      {/* Title */}
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      {/* Author */}
      <div className="h-3 bg-muted rounded w-1/2 mb-auto" />
      {/* Rating/Genre */}
      <div className="flex justify-between mt-2">
        <div className="h-3 bg-muted rounded w-8" />
        <div className="h-3 bg-muted rounded w-12" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-[300px] animate-pulse">
      <div className="h-6 bg-muted rounded w-1/3 mb-6" />
      <div className="flex items-end gap-2 h-[200px]">
        <div className="flex-1 bg-muted rounded-t h-[40%]" />
        <div className="flex-1 bg-muted rounded-t h-[70%]" />
        <div className="flex-1 bg-muted rounded-t h-[50%]" />
        <div className="flex-1 bg-muted rounded-t h-[80%]" />
        <div className="flex-1 bg-muted rounded-t h-[60%]" />
      </div>
    </div>
  );
}
