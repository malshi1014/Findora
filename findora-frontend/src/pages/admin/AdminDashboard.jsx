import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";

const activityItems = [
  {
    label: "Omindu Sandew registered as a new contributor.",
    time: "2 minutes ago",
    color: "text-blue-600",
  },
  {
    label: "New black Wallet report submitted.",
    time: "15 minutes ago",
    color: "text-indigo-600",
  },
  {
    label: "Claim #CLM-8422 approved by system.",
    time: "1 hour ago",
    color: "text-emerald-600",
  },
  {
    label: "Reward distributed to Malshi Navodya.",
    time: "3 hours ago",
    color: "text-slate-500",
  },
];

const topContributors = [
  { name: "Duvindu.", title: "Expert", points: "2,480" },
  { name: "Ashan.", title: "Contributor", points: "1,920" },
  { name: "Vishmi.", title: "Helper", points: "1,650" },
];

function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("API BASE URL:", API_BASE_URL);

      const response = await fetch(
        `${API_BASE_URL}/admin/get_dashboard_stats.php`
      );

      const text = await response.text();
      console.log("Raw dashboard stats response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Dashboard stats:", data);

      if (data.status === "success") {
        setDashboardStats(data.stats);
      } else {
        setError(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to load dashboard stats."
        );
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_dashboard_stats.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statsCards = [
    {
      label: "Total Users",
      value: dashboardStats?.total_users ?? 0,
      change: "Live",
    },
    {
      label: "Lost Reports",
      value: dashboardStats?.total_lost_reports ?? 0,
      change: "Live",
    },
    {
      label: "Found Reports",
      value: dashboardStats?.total_found_reports ?? 0,
      change: "Live",
    },
    {
      label: "Pending Matches",
      value: dashboardStats?.pending_matches ?? 0,
      change: "Review",
    },
    {
      label: "Verified Matches",
      value: dashboardStats?.verified_matches ?? 0,
      change: "Approved",
    },
    {
      label: "Complaints",
      value: dashboardStats?.total_complaints ?? 0,
      change: "Check",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto mt-12">
          <h3 className="text-lg font-bold text-red-800">Connection Failed</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-5 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Welcome Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Findora Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Welcome Back, Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Monitor platform activities and manage recovery operations from a single dashboard.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statsCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md hover:shadow-sm transition-all"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {stat.value}
                  </p>
                  <span className="mt-3.5 inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Performance Graph Section */}
            <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recovery Performance
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                    {dashboardStats?.verified_matches ?? 0}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Total verified matches approved by admins.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pending Reviews
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {dashboardStats?.pending_matches ?? 0}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <svg viewBox="0 0 600 220" className="h-44 w-full">
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>

                  {/* Simple grid lines for light theme */}
                  <line x1="20" y1="40" x2="580" y2="40" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="580" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="160" x2="580" y2="160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

                  <path
                    d="M20 160 C 120 120 180 140 260 110 S 420 80 500 100 T 580 90"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  <circle cx="20" cy="160" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="260" cy="110" r="5" fill="#818cf8" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="580" cy="90" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>

              {/* Stats Footer Box */}
              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="font-semibold text-slate-800">Lost Reports</p>
                  <p className="mt-1 text-slate-500">
                    {dashboardStats?.total_lost_reports ?? 0} reports submitted
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="font-semibold text-slate-800">Found Reports</p>
                  <p className="mt-1 text-slate-500">
                    {dashboardStats?.total_found_reports ?? 0} reports submitted
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="font-semibold text-slate-800">Total Matches</p>
                  <p className="mt-1 text-slate-500">
                    {dashboardStats?.total_matches ?? 0} matches detected
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side panel */}
          <aside className="space-y-6">
            {/* Recent Activity */}
            <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Recent Activity
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Latest actions from the platform
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  4 updates
                </span>
              </div>

              <div className="mt-6 space-y-3.5">
                {activityItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-100 bg-slate-50/30 p-3.5"
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {item.label}
                    </p>

                    <p className={`mt-1.5 text-xs font-semibold ${item.color}`}>
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Contributors */}
            <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Summary
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-950">
                    Top Contributors
                  </h3>
                </div>

                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  Rankings
                </div>
              </div>

              <div className="mt-6 space-y-3.5">
                {topContributors.map((contributor) => (
                  <div
                    key={contributor.name}
                    className="rounded-xl border border-slate-100 bg-slate-50/30 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {contributor.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {contributor.title}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-blue-600">
                        {contributor.points} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;