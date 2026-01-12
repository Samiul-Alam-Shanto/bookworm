"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Shield, ShieldAlert, ShieldCheck, User, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ManageUsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await axiosSecure.get("/admin/users")).data,
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      return await axiosSecure.patch("/admin/users", { userId, newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User role updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-serif mb-8">Manage Users</h1>

      <div className="bg-card border border-border rounded-xl overflow-x-scroll shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-muted/10">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User size={16} className="m-auto mt-2" />
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <ShieldCheck size={12} />
                    ) : (
                      <User size={12} />
                    )}
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role === "user" ? (
                    <button
                      onClick={() =>
                        roleMutation.mutate({
                          userId: user._id,
                          newRole: "admin",
                        })
                      }
                      className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        roleMutation.mutate({
                          userId: user._id,
                          newRole: "user",
                        })
                      }
                      className="text-xs border border-border hover:bg-muted px-3 py-1.5 rounded transition"
                    >
                      Remove Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
