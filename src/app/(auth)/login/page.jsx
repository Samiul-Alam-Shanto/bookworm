"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  BookOpen,
  Quote,
} from "lucide-react";
import DemoCredentials from "@/components/DemoCredentials";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result.error) {
        toast.error("Access denied. Please check your credentials.");
      } else {
        toast.success("Welcome back to your library!");
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="relative px-4 min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10"
      >
        {/* Left Side: The "Cinematic" Visual */}
        <div className="hidden lg:flex w-1/2 bg-linear-to-br from-gray-900 via-gray-900 to-black p-16 flex-col justify-between relative overflow-hidden border-r border-white/5">
          {/* Floating Book Illustration */}
          <div className="relative flex-1 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotateZ: [-2, 2, -2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow behind book */}
              <div className="absolute inset-0 bg-primary/40 blur-[60px] rounded-full scale-75" />

              {/* 3D Perspective Book Shape */}
              <div className="relative w-48 h-64 bg-white rounded-r-lg shadow-2xl overflow-hidden transform skew-y-3 border-l-12 border-primary group cursor-default">
                <div className="absolute inset-0 bg-linear-to-tr from-gray-100 to-white flex items-center justify-center">
                  <BookOpen size={60} className="text-primary/20" />
                </div>
                {/* Page Lines visual */}
                <div className="absolute right-2 top-0 bottom-0 w-1 flex flex-col gap-1 py-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-0.5 w-full bg-gray-200" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6 relative z-10">
            <Quote className="text-primary w-10 h-10 opacity-50" />
            <h2 className="text-4xl font-serif font-bold text-white leading-tight">
              A journey of <br />
              <span className="text-primary italic">a thousand pages</span>{" "}
              <br />
              continues here.
            </h2>
            <p className="text-gray-400 font-light max-w-xs leading-relaxed">
              Log in to access your curated bookmarks, reading streaks, and
              personalized recommendations.
            </p>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 bg-white flex flex-col justify-center">
          <div className="mb-12">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Sign In
              </h1>
              <div className="h-1.5 w-12 bg-primary mt-3 rounded-full" />
            </motion.div>
          </div>
          <DemoCredentials />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-1 group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-primary transition-colors">
                Member Email
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
                  placeholder="Enter your email"
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
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-primary transition-colors">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-0 bottom-3 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-primary" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      message: "Must have 6+ chars, 1 upper & 1 lowercase",
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
                  className="absolute right-0 bottom-3 text-gray-400 hover:text-primary transition-colors"
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

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-14 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transition-all disabled:opacity-70"
              >
                {/* Background Fill Hover Effect */}
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />

                <span className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                  {isSubmitting ? (
                    <>
                      Opening Gates{" "}
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Sign In{" "}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Don't have a library card?{" "}
              <Link
                href="/register"
                className="text-primary font-bold hover:text-primary/80 transition-colors underline underline-offset-4 decoration-2"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subtle Floating Elements in Background */}
      <motion.div
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-20 hidden lg:block opacity-20"
      >
        <Sparkles size={40} className="text-primary" />
      </motion.div>
    </div>
  );
}
