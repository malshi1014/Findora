import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Heart, Search, TrendingUp, User, Download } from "lucide-react";
import API_BASE_URL from "../../config/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatRs = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(d);
};

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCsv(donations) {
  const headers = ["ID", "Donor", "Email", "Amount (LKR)", "Status", "Date"];
  const rows = donations.map((d) => [
    `#DON-${d.donation_id}`,
    d.display_name || "—",
    d.donor_email  || "—",
    Number(d.amount).toFixed(2),
    d.status,
    formatDate(d.donation_date || d.created_at),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `findora_donations_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, colorClass }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md">
      <div className={`rounded-xl border p-2.5 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
        {sub && <p className="mt-1 text-[10px] text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  failed:    "bg-red-50 text-red-700 border-red-100",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${style}`}>
      {status}
    </span>
  );
}

// ── ManageDonations page ──────────────────────────────────────────────────────
function ManageDonations() {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/admin/get_all_donations.php`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const text = await response.text();
      let json;
      try { json = JSON.parse(text); }
      catch { throw new Error("The server returned an unexpected response."); }
      if (!response.ok || json.status !== "success") {
        throw new Error(json.message || `Error ${response.status}`);
      }
      setData(json);
    } catch (err) {
      setError(err.message || "Failed to load donation data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  // ── Filter by query + status ──────────────────────────────────────────────
  const filtered = (data?.recent_donations || []).filter((d) => {
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    if (!matchesStatus) return false;
    if (!query.trim()) return true;
    const term = query.toLowerCase();
    return (
      String(d.donation_id).includes(term) ||
      (d.display_name  || "").toLowerCase().includes(term) ||
      (d.donor_email   || "").toLowerCase().includes(term) ||
      (d.status        || "").toLowerCase().includes(term)
    );
  });

  const stats = data?.stats;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                Findora Admin
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Donation Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Monitor and manage all PayHere-processed community donations in real time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {data && (
                <button
                  onClick={() => exportCsv(filtered)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
              )}
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ID, donor, email…"
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Error / loading ──────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}{" "}
            <button onClick={fetchDonations} className="ml-2 font-semibold underline hover:text-red-900">
              Retry
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-sm backdrop-blur-md">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Loading donation data…</p>
          </div>
        )}

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Heart}
              label="Total Raised"
              value={formatRs(stats.total_amount)}
              sub={`${stats.total_donations} successful donations`}
              colorClass="text-rose-600 bg-rose-50 border-rose-100"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={formatRs(stats.monthly_total)}
              colorClass="text-blue-600 bg-blue-50 border-blue-100"
            />
            <StatCard
              icon={User}
              label="Unique Donors"
              value={stats.unique_donors}
              colorClass="text-emerald-600 bg-emerald-50 border-emerald-100"
            />
            <StatCard
              icon={Heart}
              label="Average Donation"
              value={formatRs(stats.avg_amount)}
              colorClass="text-purple-600 bg-purple-50 border-purple-100"
            />
          </div>
        )}

        {/* ── Main table + top donors ──────────────────────────────────────── */}
        {data && (
          <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-6">
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Donations table */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">All Donations</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Latest 20 transactions</p>
                  </div>
                  <div className="ml-auto flex flex-wrap gap-1.5">
                    {["all", "completed", "pending", "failed", "cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                          statusFilter === s
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">ID</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Donor</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Amount</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-slate-400">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                            {query || statusFilter !== "all"
                              ? `No donations match your filters`
                              : "No donations yet"}
                          </td>
                        </tr>
                      ) : (
                        filtered.map((d) => (
                          <tr key={d.donation_id} className="hover:bg-slate-100/30 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-700">
                              #DON-{d.donation_id}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-800">{d.display_name}</p>
                              {d.donor_email && (
                                <p className="text-[10px] text-slate-400">{d.donor_email}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold text-blue-600">
                              {formatRs(d.amount)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={d.status} />
                            </td>
                            <td className="px-4 py-3 text-right text-slate-500">
                              {formatDate(d.donation_date || d.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top donors sidebar */}
              <aside>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 h-full">
                  <h4 className="font-bold text-slate-900 text-sm">Top Donors</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Highest total contributions</p>

                  <div className="mt-4 space-y-3">
                    {data.top_donors.length === 0 ? (
                      <p className="text-xs text-slate-400">No donor data yet</p>
                    ) : (
                      data.top_donors.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{d.name}</p>
                              <p className="text-[9px] text-slate-400">Supporter</p>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-emerald-600">{formatRs(d.total_given)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>

            </div>
          </section>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageDonations;
