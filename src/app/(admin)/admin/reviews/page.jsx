"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Check, X, Star, MessageSquare } from "lucide-react";

export default function ModerateReviewsPage() {
  const queryClient = useQueryClient();

  // Fetch Pending Reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["adminReviews"],
    queryFn: async () => (await axiosSecure.get("/admin/reviews")).data,
  });

  // Approve/Reject Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      // Uses the PATCH route we created earlier
      if (status === "approved") {
        return await axiosSecure.patch(`/admin/reviews/${id}`, {
          status: "approved",
        });
      } else {
        return await axiosSecure.delete(`/admin/reviews/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminReviews"]);
      toast.success("Review processed");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-serif mb-8">Pending Reviews</h1>

      {reviews.length === 0 ? (
        <div className="bg-card p-12 text-center rounded-xl border border-border text-muted-foreground">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
          <p>No pending reviews. Good job!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-card p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{review.book.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {review.userName}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="font-bold">{review.rating}</span>{" "}
                  <Star size={16} fill="currentColor" />
                </div>
              </div>

              <p className="bg-muted/30 p-4 rounded-lg text-sm mb-4 italic">
                "{review.comment}"
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: review._id,
                      status: "rejected",
                    })
                  }
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium flex items-center gap-2"
                >
                  <X size={16} /> Delete
                </button>
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: review._id,
                      status: "approved",
                    })
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                >
                  <Check size={16} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
