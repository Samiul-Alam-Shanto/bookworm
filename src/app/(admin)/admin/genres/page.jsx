"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { axiosPublic, axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Loader2 } from "lucide-react";

export default function ManageGenresPage() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //  Fetch Genres
  const { data: genres = [], isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await axiosPublic.get("/genres");
      return res.data;
    },
  });

  //  Add Genre Mutation
  const addMutation = useMutation({
    mutationFn: async (newGenre) => {
      return await axiosSecure.post("/genres", newGenre);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["genres"]);
      toast.success("Genre added successfully!");
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add genre");
    },
  });

  // Handle Form Submit
  const onSubmit = (data) => {
    addMutation.mutate(data);
  };

  //   const handleDelete = (id) => {
  //      toast("Delete feature coming in v2", { icon: "🚧" });
  //   };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Manage Genres</h1>
      </div>

      {/* Add Genre Form */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add New Genre</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-4 items-start"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="e.g. Science Fiction"
              {...register("name", { required: "Genre name is required" })}
              className={`w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.name ? "border-red-500" : "border-border"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            {addMutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Plus size={18} />
            )}
            Add
          </button>
        </form>
      </div>

      {/* Genres List */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold">Existing Genres ({genres.length})</h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center text-muted-foreground">
            <Loader2 className="animate-spin mr-2" /> Loading...
          </div>
        ) : genres.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No genres found. Add one above!
          </div>
        ) : (
          <div className="divide-y divide-border">
            {genres.map((genre) => (
              <div
                key={genre._id}
                className="p-4 flex justify-between items-center hover:bg-muted/10 transition"
              >
                <span className="font-medium">{genre.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {genre.slug}
                </span>
                {/* 
                <button 
                  onClick={() => handleDelete(genre._id)}
                  className="text-red-400 hover:text-red-600 p-2 transition"
                >
                  <Trash2 size={18} />
                </button> 
                */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
