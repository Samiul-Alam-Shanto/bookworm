"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { User, Save, Loader2, Camera } from "lucide-react";
import { useState, useEffect } from "react";

// Reuse ImgBB Helper
const uploadImageToImgBB = async (file) => {
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

export default function ProfilePage() {
  const { user } = useAuth();
  const [preview, setPreview] = useState(user?.image);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Sync default values when user loads
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      Promise.resolve().then(() => {
        setPreview(user.image);
      });
    }
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: async (data) => await axiosSecure.patch("/auth/profile", data),
    onSuccess: () => {
      toast.success("Profile updated! The changes will reflect on next login.");
      // Ideally, we trigger a session update here, but a refresh works for now
      window.location.reload();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const onSubmit = async (data) => {
    try {
      let imageUrl = user?.image;

      // Check if a new file was selected
      if (data.photo && data.photo.length > 0) {
        const loadingToast = toast.loading("Uploading new photo...");
        try {
          imageUrl = await uploadImageToImgBB(data.photo[0]);
          toast.dismiss(loadingToast);
        } catch (e) {
          toast.dismiss(loadingToast);
          return toast.error("Photo upload failed");
        }
      }

      mutation.mutate({ name: data.name, image: imageUrl });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle local preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold font-serif mb-8">Profile Settings</h1>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted group">
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User size={48} className="text-muted-foreground" />
                </div>
              )}

              {/* Overlay Input */}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-xs">
                <Camera size={24} className="mb-1" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("photo", { onChange: handleFileChange })}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Click image to change
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {isSubmitting || mutation.isPending ? (
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
