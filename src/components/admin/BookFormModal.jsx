"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosSecure, axiosPublic } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { X, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

// ImgBB Helper
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (data.success) return data.data.url;
  throw new Error("Image upload failed");
};

export default function BookFormModal({ isOpen, onClose, editingBook = null }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm();

  // State for Multi-Select Genres
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Fetch Genres
  const { data: allGenres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => (await axiosPublic.get("/genres")).data,
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (editingBook) {
        setValue("title", editingBook.title);
        setValue("author", editingBook.author);
        setValue("description", editingBook.description);
        setValue("total_pages", editingBook.total_pages);
        Promise.resolve().then(() =>
          setSelectedGenres(editingBook.genres || [])
        );
      } else {
        reset();
        Promise.resolve().then(() => setSelectedGenres([]));
      }
    }
  }, [isOpen, editingBook, setValue, reset]);

  // Handle Genre Toggle
  const toggleGenre = (genreName) => {
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres((prev) => prev.filter((g) => g !== genreName));
    } else {
      setSelectedGenres((prev) => [...prev, genreName]);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (editingBook)
        return await axiosSecure.put(`/books/${editingBook._id}`, data);
      return await axiosSecure.post("/books", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["adminStats"]);
      toast.success(editingBook ? "Book updated!" : "Book added!");
      onClose();
      reset();
      setSelectedGenres([]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const onSubmit = async (data) => {
    try {
      if (selectedGenres.length === 0)
        return toast.error("Select at least one genre");

      let coverUrl = editingBook?.cover_image;
      if (data.cover_image && data.cover_image.length > 0) {
        const loadingToast = toast.loading("Uploading cover...");
        try {
          coverUrl = await uploadImage(data.cover_image[0]);
          toast.dismiss(loadingToast);
        } catch {
          toast.dismiss(loadingToast);
          return toast.error("Image upload failed");
        }
      }

      if (!editingBook && !coverUrl)
        return toast.error("Cover image is required");

      mutation.mutate({
        title: data.title,
        author: data.author,
        description: data.description,
        total_pages: data.total_pages,
        genres: selectedGenres,
        cover_image: coverUrl,
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold font-serif">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form
            id="book-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  {...register("title", { required: true })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  {...register("author", { required: true })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>

              {/* Multi-Select Genre UI */}
              <div>
                <label className="block text-sm font-medium mb-2">Genres</label>
                <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-background min-h-12.5">
                  {allGenres.map((g) => {
                    const isSelected = selectedGenres.includes(g.name);
                    return (
                      <button
                        key={g._id}
                        type="button"
                        onClick={() => toggleGenre(g.name)}
                        className={`text-xs px-2 py-1 rounded-full border transition ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-transparent hover:border-border"
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                  {allGenres.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      No genres found. Add some first!
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  {...register("total_pages", { required: true })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("cover_image")}
                  className="w-full text-sm"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition"
          >
            Cancel
          </button>
          <button
            form="book-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={16} />}
            {editingBook ? "Update Book" : "Create Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
