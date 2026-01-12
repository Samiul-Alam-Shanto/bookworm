"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function ReviewForm({ bookId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const mutation = useMutation({
    mutationFn: async (data) => await axiosSecure.post("/reviews", data),
    onSuccess: () => {
      toast.success("Review submitted! Pending approval.");
      setRating(0);
      setComment("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");
    mutation.mutate({ bookId, rating, comment });
  };

  if (!user)
    return (
      <div className="bg-muted/50 p-6 rounded-xl text-center">
        <p>
          Please{" "}
          <a href="/login" className="text-primary hover:underline">
            login
          </a>{" "}
          to write a review.
        </p>
      </div>
    );

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold font-serif mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Input */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={24}
                fill={
                  (hoveredRating || rating) >= star ? "currentColor" : "none"
                }
                className={
                  (hoveredRating || rating) >= star
                    ? "text-amber-500"
                    : "text-muted-foreground"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this book?"
          required
          rows={4}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
