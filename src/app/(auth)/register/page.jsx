"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { axiosPublic } from "@/lib/axios";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  ArrowRight,
  Library,
  Feather,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let photoUrl = "https://i.ibb.co/5GzXywq/default-avatar.png";

      if (data.photo && data.photo.length > 0) {
        const loadingToast = toast.loading("Processing your portrait...");
        try {
          photoUrl = await uploadImageToImgBB(data.photo[0]);
          toast.dismiss(loadingToast);
        } catch (imgError) {
          toast.dismiss(loadingToast);
          toast.error("Photo upload failed, using default avatar.");
        }
      }

      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        photo: photoUrl,
      };

      await axiosPublic.post("/auth/register", userInfo);

      toast.loading("Publishing your profile...");
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      toast.dismiss();

      if (loginResult?.error) {
        toast.error("Account created! Please sign in manually.");
        router.push("/login");
      } else {
        toast.success("Welcome to the BookWorm family!");
        router.refresh();
        router.push("/dashboard");
      }
    } catch (error) {
      toast.dismiss();
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 m-4"
      >
        {/* Left Side: Cinematic Visual */}
        <div className="hidden lg:flex w-[45%] bg-linear-to-tr from-gray-900 via-gray-900 to-black p-16 flex-col justify-between relative overflow-hidden border-r border-white/5">
          <div className="relative flex-1 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full scale-110" />
              <div className="relative -space-y-45">
                <div className="w-40 h-56 bg-white rounded-r-lg shadow-2xl border-l-10 border-indigo-500 transform -rotate-12 translate-x-4 skew-y-3" />
                <div className="w-40 h-56 bg-gray-100 rounded-r-lg shadow-2xl border-l-10 border-primary transform rotate-3 translate-x-2 skew-y-2" />
                <div className="w-40 h-56 bg-white rounded-r-lg shadow-2xl border-l-10 border-indigo-400 transform -rotate-6 skew-y-1 flex items-center justify-center">
                  <Library size={40} className="text-primary/20" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Feather className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-white leading-tight">
              Write your <br />
              <span className="text-primary italic">first chapter</span> <br />
              with us.
            </h2>
            <p className="text-gray-400 font-light max-w-xs leading-relaxed">
              Every great library starts with a single book. Every great journey
              starts with a single click.
            </p>
          </div>
        </div>

        {/* Right Side: Editorial Form */}
        <div className="w-full lg:w-[55%] p-8 lg:p-16 bg-white flex flex-col justify-center">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Register
              </h1>
              <div className="h-1.5 w-12 bg-primary mt-3 rounded-full" />
            </div>
            <Link
              href="/login"
              className="text-sm font-bold text-gray-400 hover:text-primary transition-colors pb-1"
            >
              Already a Member?
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* Full Name */}
              <div className="space-y-1 group relative">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-primary transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-0 bottom-3 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-primary" />
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full pl-9 pr-3 py-3 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-300 outline-none transition-all ${
                      errors.name
                        ? "border-red-400"
                        : "focus:border-primary border-b-2"
                    }`}
                    placeholder="Type your name"
                  />
                </div>
                {errors.name && (
                  <span className="text-[11px] text-red-500 font-medium">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Profile Portrait
                </label>
                <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-100 hover:border-primary/30 hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("photo", {
                      onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) setFileName(file.name);
                      },
                    })}
                  />
                  <Upload
                    size={18}
                    className={fileName ? "text-primary" : "text-gray-300"}
                  />
                  <span className="text-xs font-bold text-gray-500 truncate max-w-30">
                    {fileName || "Select Image"}
                  </span>
                </label>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1 group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-primary transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 bottom-3 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-primary" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full pl-9 pr-3 py-3 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-300 outline-none transition-all ${
                    errors.email
                      ? "border-red-400"
                      : "focus:border-primary border-b-2"
                  }`}
                  placeholder="reader@email.com"
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1 group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-primary transition-colors">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 bottom-3 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-primary" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                      message: "Min 6 chars, 1 upper & 1 lowercase",
                    },
                  })}
                  className={`w-full pl-9 pr-12 py-3 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-300 outline-none transition-all ${
                    errors.password
                      ? "border-red-400"
                      : "focus:border-primary border-b-2"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-gray-400 hover:text-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-14 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl disabled:opacity-70 transition-all"
              >
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
                <span className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                  {isSubmitting ? (
                    <>
                      Creating your legend...{" "}
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Join BookWorm{" "}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-10 right-10 opacity-20 pointer-events-none"
      >
        <Library size={80} className="text-primary" />
      </motion.div>
    </div>
  );
}
