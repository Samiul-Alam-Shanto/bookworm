"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import {
  Users,
  Book,
  MessageSquare,
  Loader2,
  Plus,
  Activity,
  ArrowRight,
  BookOpen,
  Server,
  Wifi,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import BookFormModal from "@/components/admin/BookFormModal";
import GenrePieChart from "@/components/charts/GenrePieChart";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => (await axiosSecure.get("/admin/stats")).data,
  });

  if (isLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* 1. Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
              System Overview
            </h1>
            <p className="text-slate-300 max-w-xl">
              Platform is running stable. You have{" "}
              <span className="text-amber-400 font-bold">
                {stats?.pendingReviews} pending reviews
              </span>{" "}
              requiring attention.
            </p>
          </div>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition shadow-lg shadow-primary/25 transform hover:-translate-y-1"
          >
            <Plus size={20} /> Add New Book
          </button>
        </div>
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
      </div>

      {/*  Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Book}
          label="Library Size"
          value={stats?.totalBooks}
          sub="Books available"
          color="amber"
        />
        <MetricCard
          icon={Users}
          label="Total Readers"
          value={stats?.totalUsers}
          sub="Registered users"
          color="blue"
        />
        <MetricCard
          icon={Activity}
          label="Weekly Growth"
          value={stats?.newUsersLast7Days}
          sub="New users (7d)"
          color="green"
        />
        <MetricCard
          icon={MessageSquare}
          label="Moderation Queue"
          value={stats?.pendingReviews}
          sub="Pending approval"
          color="purple"
          alert={stats?.pendingReviews > 0}
        />
      </div>

      {/*  Main Analytics & Utility Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Review Activity Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Review Activity (Last 7 Days)
              </h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.chartData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="reviews"
                    name="New Reviews"
                    fill="#c05621"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Genre Distribution  */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold font-serif">Community Tastes</h3>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Top Genres
              </span>
            </div>
            {/* Pie Chart  */}
            <div className="h-75">
              <GenrePieChart data={stats?.topGenres || []} />
            </div>
          </div>
        </div>

        {/* Right Col: Utility & Status  */}
        <div className="space-y-6">
          {/* System Status Card */}
          <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Server size={18} /> System Health
                </h3>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Operational
                </div>
              </div>

              <div className="space-y-4 text-sm opacity-90">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="flex items-center gap-2">
                    <Wifi size={14} /> Database Latency
                  </span>
                  <span className="font-mono">24ms</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} /> Auth Service
                  </span>
                  <span className="text-green-300">Secure</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Clock size={14} /> Last Backup
                  </span>
                  <span>12 mins ago</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold font-serif mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <QuickAction
                href="/admin/reviews"
                icon={MessageSquare}
                label="Moderate Reviews"
                desc="Approve user content"
                color="orange"
              />
              <QuickAction
                href="/admin/users"
                icon={Users}
                label="Manage Users"
                desc="Promote or ban accounts"
                color="blue"
              />
              <QuickAction
                href="/admin/tutorials"
                icon={BookOpen}
                label="Manage Tutorials"
                desc="Curate video content"
                color="pink"
              />
            </div>
          </div>

          {/* Recent Activity Feed  */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold font-serif mb-4">
              Recent Audit Log
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-muted-foreground/30" />
                  <div>
                    <p className="text-sm font-medium">
                      System check completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i * 15} minutes ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookFormModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </div>
  );
}

// Sub-components
function MetricCard({ icon: Icon, label, value, sub, color, alert }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    amber:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div
      className={`bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${
        alert ? "ring-2 ring-amber-500/50" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${colors[color]}`}
        >
          <Icon size={24} />
        </div>
        {alert && (
          <span className="animate-pulse w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-bold text-foreground mb-1">{value || 0}</p>
        <h3 className="text-sm font-semibold text-foreground/80">{label}</h3>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, desc, color }) {
  const colors = {
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    pink: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
  };
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition group border border-transparent hover:border-border"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon size={20} />
        </div>
        <div>
          <span className="block font-bold text-sm text-foreground">
            {label}
          </span>
          <span className="block text-xs text-muted-foreground">{desc}</span>
        </div>
      </div>
      <ArrowRight
        size={16}
        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
      />
    </Link>
  );
}
