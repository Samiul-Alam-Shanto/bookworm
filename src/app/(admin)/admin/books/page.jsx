"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic, axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import BookFormModal from "@/components/admin/BookFormModal";
export default function ManageBooksPage() {
  const queryClient = useQueryClient();

  // Clean State: Only need modal control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => (await axiosPublic.get("/books")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      Swal.fire("Deleted!", "Book removed.", "success");
    },
  });

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c05621",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Manage Books</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

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
                    No books found.
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
                      {/*  Multi-Select Display */}
                      {book.genres?.map((g) => (
                        <span
                          key={g}
                          className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mr-1 mb-1"
                        >
                          {g}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm">{book.total_pages}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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

      {/* Modal */}
      <BookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingBook={editingBook}
      />
    </div>
  );
}
