"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic, axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Plus, Edit, Trash2, Loader2, Search, X } from "lucide-react";
import Swal from "sweetalert2";
import BookFormModal from "@/components/admin/BookFormModal";

export default function ManageBooksPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => (await axiosPublic.get("/books")).data,
  });

  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
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
      {/* Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-serif">Manage Books</h1>

        <div className="flex gap-3 w-full md:w-auto">
          {/* [NEW] Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium shadow-sm whitespace-nowrap"
          >
            <Plus size={18} />{" "}
            <span className="hidden sm:inline">Add Book</span>
          </button>
        </div>
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
              ) : filteredBooks.length === 0 ? (
                // Handle Empty State based on Search vs Empty DB
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    {searchTerm
                      ? `No books found matching "${searchTerm}"`
                      : "No books found. Add one to get started!"}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
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
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
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

      <BookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingBook={editingBook}
      />
    </div>
  );
}
