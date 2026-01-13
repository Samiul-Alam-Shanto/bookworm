"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { User, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      // Email is read-only usually
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => await axiosSecure.patch("/auth/profile", data), // We need this API
    onSuccess: () => {
      toast.success("Profile updated! Please re-login to see changes.");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold font-serif mb-8">Profile Settings</h1>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
            {user?.image ? (
              <Image
                src={user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User size={40} />
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
