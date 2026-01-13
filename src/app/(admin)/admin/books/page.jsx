"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { axiosPublic, axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import Swal from "sweetalert2"; // Standard SweetAlert2 only

// ImgBB Upload Helper
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  if (data.success) return data.data.url;
  throw new Error("Image upload failed");
};

export default function ManageBooksPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  //  Fetch Books
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosPublic.get("/books");
      return res.data;
    },
  });

  //  Fetch Genres
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await axiosPublic.get("/genres");
      return res.data;
    },
  });

  //  Create/Update
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingBook) {
        return await axiosSecure.put(`/books/${editingBook._id}`, data);
      } else {
        return await axiosSecure.post("/books", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success(editingBook ? "Book updated!" : "Book created!");
      closeForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  //  Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      Swal.fire({
        title: "Deleted!",
        text: "The book has been removed.",
        icon: "success",
        confirmButtonColor: "#c05621",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Failed to delete book.",
        icon: "error",
      });
    },
  });

  // Form Handlers
  const handleEdit = (book) => {
    setEditingBook(book);
    setValue("title", book.title);
    setValue("author", book.author);
    setValue("description", book.description);
    setValue("total_pages", book.total_pages);
    if (book.genres && book.genres.length > 0) {
      setValue("genre", book.genres[0]);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBook(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      let coverUrl = editingBook?.cover_image;

      if (data.cover_image && data.cover_image.length > 0) {
        const loadingToast = toast.loading("Uploading cover...");
        try {
          coverUrl = await uploadImage(data.cover_image[0]);
          toast.dismiss(loadingToast);
        } catch (e) {
          toast.dismiss(loadingToast);
          return toast.error("Image upload failed");
        }
      }

      // If creating new book, ensure to have an image
      if (!editingBook && !coverUrl) {
        return toast.error("Cover image is required");
      }

      const payload = {
        title: data.title,
        author: data.author,
        description: data.description,
        total_pages: data.total_pages,
        genres: [data.genre],
        cover_image: coverUrl,
      };

      saveMutation.mutate(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c05621",
      cancelButtonColor: "#718096",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Manage Books</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>
            <button
              onClick={closeForm}
              className="p-2 hover:bg-muted rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <form
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
              <div>
                <label className="block text-sm font-medium mb-1">Genre</label>
                <select
                  {...register("genre", { required: true })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Select Genre</option>
                  {genres.map((g) => (
                    <option key={g._id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
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
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  rows={4}
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
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 w-full md:w-auto"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingBook
                    ? "Update Book"
                    : "Create Book"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Cover</th>
                <th className="px-6 py-4">Title / Author</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Pages</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <Loader2 className="animate-spin inline-block mr-2" />{" "}
                    Loading...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No books found. Add some!
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="hover:bg-muted/10 transition">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-16 rounded overflow-hidden shadow-sm bg-muted">
                        <Image
                          src={book.cover_image}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {book.author}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {book.genres?.map((g) => (
                        <span
                          key={g}
                          className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mr-1"
                        >
                          {g}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm">{book.total_pages}</td>
                    <td className="px-6 py-4 text-right xl:space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
