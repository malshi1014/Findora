import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";

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
    // Auto-refresh every 30 seconds for real-time stats
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    {
      label: "Total Users",
      value: dashboardStats?.total_users ?? 0,
      change: "Live",
      colors: { text: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100/60" },
      pill: { text: "text-blue-700", bg: "bg-blue-100" }
    },
    {
      label: "Lost Reports",
      value: dashboardStats?.total_lost_reports ?? 0,
      change: "Live",
      colors: { text: "text-rose-600", bg: "bg-rose-50/50", border: "border-rose-100/60" },
      pill: { text: "text-rose-700", bg: "bg-rose-100" }
    },
    {
      label: "Found Reports",
      value: dashboardStats?.total_found_reports ?? 0,
      change: "Live",
      colors: { text: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100/60" },
      pill: { text: "text-emerald-700", bg: "bg-emerald-100" }
    },
    {
      label: "Pending Matches",
      value: dashboardStats?.pending_matches ?? 0,
      change: "Review",
      colors: { text: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-100/60" },
      pill: { text: "text-amber-700", bg: "bg-amber-100" }
    },
    {
      label: "Verified Matches",
      value: dashboardStats?.verified_matches ?? 0,
      change: "Approved",
      colors: { text: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-indigo-100/60" },
      pill: { text: "text-indigo-700", bg: "bg-indigo-100" }
    },
    {
      label: "Complaints",
      value: dashboardStats?.total_complaints ?? 0,
      change: "Check",
      colors: { text: "text-purple-600", bg: "bg-purple-50/50", border: "border-purple-100/60" },
      pill: { text: "text-purple-700", bg: "bg-purple-100" }
    },
  ];

  const graphData = dashboardStats?.graph_data || [0, 0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...graphData, 1);
  const points = graphData.map((val, i) => {
    const x = 20 + (i * (560 / (Math.max(graphData.length - 1, 1))));
    const y = 180 - ((val / maxVal) * 140);
    return { x, y };
  });
  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}` : "";
  // Area fill path: line path + bottom corners
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`
    : "";
  // Last 7 day labels
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });
  // Bar chart for reports breakdown
  const barStats = [
    { label: "Lost", value: dashboardStats?.total_lost_reports ?? 0, color: "#f43f5e", light: "#fef1f3" },
    { label: "Found", value: dashboardStats?.total_found_reports ?? 0, color: "#10b981", light: "#f0fdf8" },
    { label: "Suspicious", value: dashboardStats?.total_suspicious_reports ?? 0, color: "#f59e0b", light: "#fffbeb" },
  ];
  const barMax = Math.max(...barStats.map(b => b.value), 1);

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

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statsCards.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border ${stat.colors.border} ${stat.colors.bg} p-5 shadow-xs backdrop-blur-md hover:shadow-sm transition-all`}
              >
                <p className={`text-xs font-bold uppercase tracking-wider ${stat.colors.text}`}>
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {stat.value}
                </p>
                <span className={`mt-3.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${stat.pill.bg} ${stat.pill.text}`}>
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

            {/* Line Chart – Matches last 7 days */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Matches - Last 7 Days</p>
              <svg viewBox="0 0 600 230" className="h-44 w-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="20" y1="40" x2="580" y2="40" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="580" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1="160" x2="580" y2="160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

                {/* Area fill */}
                {areaD && <path d={areaD} fill="url(#areaGradient)" />}

                {/* Line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points */}
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                ))}

                {/* X-axis day labels */}
                {points.map((p, i) => (
                  <text
                    key={`lbl-${i}`}
                    x={p.x}
                    y="215"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#94a3b8"
                    fontFamily="system-ui, sans-serif"
                  >
                    {dayLabels[i]}
                  </text>
                ))}
              </svg>
            </div>

            {/* Bar Chart – Reports breakdown */}
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <p className="mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports Breakdown</p>
              <div className="space-y-3">
                {barStats.map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-semibold text-slate-600">{b.label}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-slate-200 h-2.5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(b.value / barMax) * 100}%`,
                          backgroundColor: b.color,
                        }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs font-bold" style={{ color: b.color }}>
                      {b.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {barStats.map((b) => (
                  <div
                    key={b.label}
                    className="rounded-xl border p-3 text-center"
                    style={{ borderColor: `${b.color}33`, backgroundColor: b.light }}
                  >
                    <p className="text-lg font-bold" style={{ color: b.color }}>{b.value}</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">{b.label} Reports</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;