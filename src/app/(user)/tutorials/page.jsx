"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";
import { Loader2, Video } from "lucide-react";

export default function TutorialsPage() {
  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: async () => (await axiosPublic.get("/tutorials")).data,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-serif mb-4">
          Book Community & Tips
        </h1>
        <p className="text-muted-foreground">
          Curated reviews, reading tips, and author interviews to enhance your
          journey.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : tutorials.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <p>No tutorials added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((video) => (
            <div
              key={video._id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* YouTube Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-serif line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
