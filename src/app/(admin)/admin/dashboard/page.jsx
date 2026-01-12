"use client";

import useAuth from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here is an overview of the platform.
        </p>
      </div>

      {/* Stats Grid - We will populate real data in Phase 6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Users
          </h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Books
          </h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Pending Reviews
          </h3>
          <p className="text-3xl font-bold mt-2 text-primary">--</p>
        </div>
      </div>
    </div>
  );
}
