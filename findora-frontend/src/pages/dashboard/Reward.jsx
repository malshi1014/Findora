import { useCallback, useEffect, useState } from "react";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatRs = (v) =>
  `Rs ${Number(v || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? v
    : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(d);
};

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  paid:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

// ── Milestone badges config ───────────────────────────────────────────────────
const MILESTONES = [
  { recoveries: 1,  emoji: "🏅", label: "First Recovery",      desc: "You returned your first item!" },
  { recoveries: 3,  emoji: "⭐", label: "Helper",               desc: "3 successful recoveries" },
  { recoveries: 5,  emoji: "🔥", label: "Community Hero",       desc: "5 successful recoveries" },
  { recoveries: 10, emoji: "🏆", label: "Top Contributor",      desc: "10 successful recoveries" },
  { recoveries: 25, emoji: "💎", label: "Recovery Legend",      desc: "25 successful recoveries" },
];

function BadgeCard({ milestone, unlocked }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        unlocked
          ? "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm"
          : "border-slate-100 bg-slate-50 opacity-50 grayscale"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
          unlocked ? "bg-amber-100" : "bg-slate-100"
        }`}
      >
        {unlocked ? milestone.emoji : "🔒"}
      </div>
      <div>
        <p className={`text-sm font-bold ${unlocked ? "text-slate-800" : "text-slate-400"}`}>
          {milestone.label}
        </p>
        <p className="text-[11px] text-slate-500">{milestone.desc}</p>
      </div>
      {unlocked && (
        <span className="ml-auto shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          Unlocked
        </span>
      )}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, colorBg, colorText }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-xs backdrop-blur-md">
      <div className={`rounded-xl p-2.5 text-lg ${colorBg}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${colorText}`}>{value}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function Reward() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/rewards/get_my_rewards.php`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { throw new Error("Unexpected server response"); }
      if (!res.ok || json.status !== "success") throw new Error(json.message || `Error ${res.status}`);
      setData(json);
    } catch (err) {
      setError(err.message || "Failed to load reward data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRewards(); }, [fetchRewards]);

  const stats    = data?.stats;
  const rewards  = data?.rewards || [];
  const totalRecoveries = stats?.total_rewards ?? 0;
  const nextMilestone   = MILESTONES.find((m) => m.recoveries > totalRecoveries);
  const progress        = nextMilestone
    ? Math.min((totalRecoveries / nextMilestone.recoveries) * 100, 100)
    : 100;

  return (
    <RoleBasedLayout>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 shadow-xl shadow-amber-300/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100">
                My Rewards
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Your Contributions
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-amber-100">
                Every item you return earns you a Rs.&nbsp;100 mobile reload reward. Keep
                helping your community!
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white/20 px-8 py-5 backdrop-blur-md">
              <p className="text-4xl font-bold text-white">
                {stats ? formatRs(stats.total_earned) : "—"}
              </p>
              <p className="text-xs font-semibold text-amber-100">Total Earned</p>
            </div>
          </div>
        </section>

        {/* ── Error / Loading ─────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}{" "}
            <button onClick={fetchRewards} className="ml-2 font-semibold underline">
              Retry
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-100 border-t-amber-500" />
            <p className="mt-4 text-sm text-slate-500">Loading your rewards…</p>
          </div>
        )}

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon="🔄" label="Total Recoveries"  value={stats.total_rewards}  colorBg="bg-blue-50"    colorText="text-blue-700" />
            <StatCard icon="✅" label="Rewards Paid"       value={stats.paid_count}     colorBg="bg-emerald-50" colorText="text-emerald-700" />
            <StatCard icon="⏳" label="Pending Rewards"    value={stats.pending_count}  colorBg="bg-amber-50"   colorText="text-amber-700" />
            <StatCard icon="💰" label="Total Value Earned" value={formatRs(stats.total_earned)} colorBg="bg-rose-50" colorText="text-rose-700" />
          </div>
        )}

        {data && (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ── Reward history table ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-950">Reward History</h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Rewards earned from verified match recoveries
                  </p>
                </div>

                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Item</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Amount</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-slate-400">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rewards.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <span className="text-4xl">🎯</span>
                              <p className="font-semibold text-slate-600">No rewards yet</p>
                              <p className="text-xs text-slate-400">
                                Help find and return lost items to earn your first reward!
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        rewards.map((r) => (
                          <tr key={r.reward_id} className="hover:bg-slate-100/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800">{r.lost_item_title}</p>
                              <p className="text-[10px] text-slate-400">{r.lost_item_category}</p>
                            </td>
                            <td className="px-4 py-3 font-bold text-amber-600">
                              {formatRs(r.amount)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={r.status} />
                            </td>
                            <td className="px-4 py-3 text-right text-slate-500">
                              {formatDate(r.match_verified_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ── Badges + Progress sidebar ─────────────────────────────── */}
            <div className="space-y-4">

              {/* Progress toward next milestone */}
              <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-bold text-slate-800">
                  {nextMilestone ? `Next: ${nextMilestone.label}` : "All milestones reached! 🎉"}
                </h3>
                {nextMilestone && (
                  <>
                    <p className="mt-1 text-xs text-slate-500">
                      {totalRecoveries} / {nextMilestone.recoveries} recoveries
                    </p>
                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {nextMilestone.recoveries - totalRecoveries} more {nextMilestone.recoveries - totalRecoveries === 1 ? "recovery" : "recoveries"} to go
                    </p>
                  </>
                )}
              </div>

              {/* Badge list */}
              <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-bold text-slate-800">Badges</h3>
                <div className="mt-3 space-y-2">
                  {MILESTONES.map((m) => (
                    <BadgeCard
                      key={m.recoveries}
                      milestone={m}
                      unlocked={totalRecoveries >= m.recoveries}
                    />
                  ))}
                </div>
              </div>

              {/* How rewards work */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs font-bold text-amber-800">💡 How rewards work</p>
                <ul className="mt-2 space-y-1.5 text-[11px] text-amber-700">
                  <li>• Submit a found item report</li>
                  <li>• Admin verifies it matches a lost report</li>
                  <li>• You automatically earn a Rs. 100 mobile reload</li>
                  <li>• Admin sends the reload to your phone number</li>
                </ul>
              </div>
            </div>

          </div>
        )}

      </div>
    </RoleBasedLayout>
  );
}

export default Reward;
