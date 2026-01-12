"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { axiosPublic } from "@/lib/axios";

// Helper function remains outside component
const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const url = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;

  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();

  if (data.success) return data.data.url;
  throw new Error("Image upload failed");
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      //   Image Upload
      let photoUrl = "https://i.ibb.co/5GzXywq/default-avatar.png";

      if (data.photo && data.photo.length > 0) {
        const loadingToast = toast.loading("Uploading photo...");
        try {
          photoUrl = await uploadImageToImgBB(data.photo[0]);
          toast.dismiss(loadingToast);
        } catch (imgError) {
          toast.dismiss(loadingToast);
          toast.error("Photo upload failed, using default.");
        }
      }

      //  Prepare Payload
      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        photo: photoUrl,
      };

      // Register User
      await axiosPublic.post("/auth/register", userInfo);

      // AUTO LOGIN
      toast.loading("Logging you in...");

      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      toast.dismiss();

      if (loginResult.error) {
        toast.error(
          "Account created, but auto-login failed. Please login manually."
        );
        router.push("/login");
      } else {
        toast.success("Welcome to BookWorm!");
        router.refresh();
        router.push("/library");
      }
    } catch (error) {
      toast.dismiss();
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border border-border">
        <h1 className="text-3xl font-bold font-serif text-center mb-2">
          Join BookWorm
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Start your reading journey
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.name ? "border-red-500" : "border-border"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              className={`w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.email ? "border-red-500" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.password ? "border-red-500" : "border-border"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Photo Input  */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
