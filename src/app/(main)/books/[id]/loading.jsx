import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium animate-pulse">
          Loading BookWorm...
        </p>
      </div>
    </div>
  );
}
