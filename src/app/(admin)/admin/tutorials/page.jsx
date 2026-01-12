"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { axiosPublic, axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Trash2, Video, Plus, ExternalLink } from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";

export default function AdminTutorialsPage() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: tutorials = [] } = useQuery({
    queryKey: ["tutorials"],
    queryFn: async () => (await axiosPublic.get("/tutorials")).data,
  });

  const addMutation = useMutation({
    mutationFn: async (data) => await axiosSecure.post("/tutorials", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tutorials"]);
      toast.success("Video added!");
      reset();
    },
    onError: () => toast.error("Invalid YouTube URL"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/tutorials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tutorials"]);
      toast.success("Deleted");
    },
  });

  const onSubmit = (data) => addMutation.mutate(data);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c05621",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold font-serif">Manage Tutorials</h1>

      {/* Add Form */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add YouTube Video</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            {...register("title", { required: true })}
            placeholder="Video Title (e.g., 'Top 10 Fantasy Books')"
            className="px-4 py-2 border border-border rounded-lg bg-background"
          />
          <div className="flex gap-2">
            <input
              {...register("url", { required: true })}
              placeholder="YouTube URL"
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background"
            />
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {tutorials.map((video) => (
          <div
            key={video._id}
            className="bg-card p-4 rounded-lg border border-border flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <Image
                width={96}
                height={64}
                src={`https://img.youtube.com/vi/${video.videoId}/default.jpg`}
                alt="thumbnail"
                className="w-24 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">{video.title}</h3>
                <a
                  href={video.url}
                  target="_blank"
                  className="text-xs text-primary flex items-center gap-1"
                >
                  View on YouTube <ExternalLink size={10} />
                </a>
              </div>
            </div>
            <button
              onClick={() => handleDelete(video._id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
