"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { ChevronDown, Check, Loader2, BookOpen } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ShelfButton({
  bookId,
  initialStatus,
  initialProgress,
  totalPages,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Local state for immediate UI feedback
  const [status, setStatus] = useState(initialStatus || "none");
  const [progress, setProgress] = useState(initialProgress || 0);
  const [isOpen, setIsOpen] = useState(false);

  // Mutation
  const mutation = useMutation({
    mutationFn: async ({ newStatus, newProgress }) => {
      return await axiosSecure.post("/library", {
        bookId,
        shelf: newStatus,
        progress: newProgress,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["library"]);
      if (status === "read") toast.success("Book finished! 🎉");
    },
    onError: () => {
      toast.error("Failed to update library");
    },
  });

  const handleSelect = (newStatus) => {
    if (!user) return router.push("/login");

    setStatus(newStatus);
    setIsOpen(false);

    // Default logic: If "Read", progress = 100%. If "Want", progress = 0.
    let newProgress = progress;
    if (newStatus === "read") newProgress = totalPages;
    if (newStatus === "want-to-read") newProgress = 0;

    mutation.mutate({ newStatus, newProgress });
  };

  const handleProgressChange = (e) => {
    const val = Number(e.target.value);
    if (val > totalPages) return;
    setProgress(val);
  };

  const handleProgressBlur = () => {
    mutation.mutate({ newStatus: status, newProgress: progress });
  };

  const getLabel = () => {
    switch (status) {
      case "want-to-read":
        return "Want to Read";
      case "currently-reading":
        return "Currently Reading";
      case "read":
        return "Read";
      default:
        return "Add to Shelf";
    }
  };

  const getColor = () => {
    if (status === "none") return "bg-primary text-primary-foreground";
    return "bg-muted text-foreground border border-border";
  };

  return (
    <div className="flex flex-col gap-3 w-full md:w-64">
      {/* Main Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition ${getColor()}`}
        >
          <span className="flex items-center gap-2">
            {mutation.isPending && (
              <Loader2 className="animate-spin" size={16} />
            )}
            {getLabel()}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            {["want-to-read", "currently-reading", "read", "none"].map(
              (opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left px-4 py-3 hover:bg-muted text-sm flex items-center justify-between transition"
                >
                  <span className="capitalize">{opt.replace(/-/g, " ")}</span>
                  {status === opt && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Progress Bar  */}
      {status === "currently-reading" && (
        <div className="bg-card p-4 rounded-lg border border-border animate-in slide-in-from-top-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round((progress / totalPages) * 100)}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
              style={{ width: `${(progress / totalPages) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={progress}
              onChange={handleProgressChange}
              onBlur={handleProgressBlur}
              className="w-20 px-2 py-1 text-sm border border-border rounded bg-background"
            />
            <span className="text-sm text-muted-foreground">
              / {totalPages} pages
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
