import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";
import { Users, Search, PackageCheck, GitMerge, FileText, CheckCircle2, AlertCircle } from "lucide-react";

function AdminStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/admin/get_dashboard_stats.php`);
      const text = await response.text();

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      if (data.status === "success") {
        setStats(data.stats);
      } else {
        setError(data.message || "Failed to load statistics.");
      }
    } catch (err) {
      console.error("Statistics loading error:", err);
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
            onClick={fetchStats}
            className="mt-5 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  const totalReports = (stats?.total_lost_reports ?? 0) + (stats?.total_found_reports ?? 0);
  const recoveryRate = stats?.total_matches > 0 
    ? Math.round(((stats?.verified_matches ?? 0) / stats.total_matches) * 100) 
    : 0;

  const statItems = [
    {
      label: "Total Users",
      value: stats?.total_users ?? 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      description: "Registered platform accounts",
    },
    {
      label: "Lost Item Posts",
      value: stats?.total_lost_reports ?? 0,
      icon: Search,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      description: "Submitted missing items",
    },
    {
      label: "Found Item Posts",
      value: stats?.total_found_reports ?? 0,
      icon: PackageCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      description: "Submitted recovery items",
    },
    {
      label: "System Matches",
      value: stats?.total_matches ?? 0,
      icon: GitMerge,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      description: "Auto-detected connections",
    },
    {
      label: "Verified Matches",
      value: stats?.verified_matches ?? 0,
      icon: CheckCircle2,
      color: "text-sky-600 bg-sky-50 border-sky-100",
      description: "Successfully recovered items",
    },
    {
      label: "Outstanding Complaints",
      value: stats?.total_complaints ?? 0,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      description: "User flagged reports",
    },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Findora Admin</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Analytics & Statistics</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            View aggregated platform performance, matching trends, and user statistics.
          </p>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.label}
                className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md flex items-start gap-4 hover:shadow-sm transition-all"
              >
                <div className={`rounded-xl p-3 border ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Breakdown Card */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recovery Performance Ring */}
          <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Match Success Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ratio of verified/recovered matches to total matches</p>
            </div>

            <div className="flex flex-col items-center justify-center my-6 py-4">
              <div className="relative flex items-center justify-center">
                {/* SVG Radial Progress */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    className="text-slate-100" 
                    strokeWidth="10" 
                    stroke="currentColor" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    className="text-blue-600" 
                    strokeWidth="10" 
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * recoveryRate) / 100}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-extrabold text-slate-950">{recoveryRate}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Detected Matches</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{stats?.total_matches ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Verified & Recovered</p>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats?.verified_matches ?? 0}</p>
              </div>
            </div>
          </section>

          {/* Ratio Comparison Cards */}
          <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Lost vs Found Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of platform item registrations</p>
            </div>

            <div className="my-6 space-y-4">
              {/* Lost Percentage */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Lost Items ({stats?.total_lost_reports ?? 0})</span>
                  <span>{totalReports > 0 ? Math.round(((stats?.total_lost_reports ?? 0) / totalReports) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full" 
                    style={{ width: `${totalReports > 0 ? ((stats?.total_lost_reports ?? 0) / totalReports) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Found Percentage */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Found Items ({stats?.total_found_reports ?? 0})</span>
                  <span>{totalReports > 0 ? Math.round(((stats?.total_found_reports ?? 0) / totalReports) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${totalReports > 0 ? ((stats?.total_found_reports ?? 0) / totalReports) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-slate-500">
                A higher ratio of found items indicates healthy community participation and recovery engagement.
              </p>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminStatistics;
