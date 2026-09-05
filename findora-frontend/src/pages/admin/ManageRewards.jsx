import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Search, Trophy, Gift, CheckCircle, Clock, DollarSign, X } from "lucide-react";
import API_BASE_URL from "../../config/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCsrfToken = () => localStorage.getItem("findora_csrf_token") || "";

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

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ reward, action, transRef, setTransRef, onConfirm, onCancel, busy }) {
  const isPaid = action === "paid";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-950">
          {isPaid ? "Mark as Paid" : "Cancel Reward"}
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {isPaid
            ? `Confirm that the Rs ${reward.amount} mobile reload has been sent to ${reward.finder_name}.`
            : `Are you sure you want to cancel this reward for ${reward.finder_name}?`}
        </p>

        {isPaid && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Transaction Reference <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dialog Reload #123456"
              value={transRef}
              onChange={(e) => setTransRef(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold text-white transition ${
              isPaid
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                : "bg-red-500 hover:bg-red-600"
            } disabled:opacity-50`}
          >
            {busy ? "Saving…" : isPaid ? "Confirm Paid" : "Cancel Reward"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Amount editor ─────────────────────────────────────────────────────────────
function RewardAmountEditor({ current, onSaved }) {
  const [editing,  setEditing]  = useState(false);
  const [newAmt,   setNewAmt]   = useState(String(current));
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState("");

  const handleSave = async () => {
    const parsed = parseFloat(newAmt);
    if (isNaN(parsed) || parsed < 1) { setMsg("Enter a valid amount ≥ Rs. 1"); return; }
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/update_reward_amount.php`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
        body:        JSON.stringify({ amount: parsed }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") throw new Error(json.message);
      setMsg(`✅ Updated to Rs. ${parsed.toFixed(2)}`);
      setEditing(false);
      onSaved(parsed);
    } catch (err) {
      setMsg("❌ " + (err.message || "Failed to update"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        Reward Amount Setting
      </p>
      <p className="mt-1 text-xs text-blue-700">
        Amount auto-assigned to the finder when a match is verified.
      </p>

      {editing ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Rs.</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={newAmt}
            onChange={(e) => setNewAmt(e.target.value)}
            className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-400"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => { setEditing(false); setNewAmt(String(current)); setMsg(""); }}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-2xl font-bold text-blue-700">{formatRs(current)}</p>
          <button
            onClick={() => { setEditing(true); setMsg(""); }}
            className="rounded-full border border-blue-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 transition hover:bg-blue-50"
          >
            Change
          </button>
        </div>
      )}

      {msg && <p className="mt-2 text-xs font-semibold text-blue-800">{msg}</p>}
    </div>
  );
}

// ── ManageRewards page ────────────────────────────────────────────────────────
function ManageRewards() {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rewardAmt,    setRewardAmt]    = useState(100);

  // Confirm-modal state
  const [pending, setPending]   = useState(null); // { reward, action }
  const [transRef, setTransRef] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/admin/get_all_rewards.php`, {
        credentials: "include",
        headers:     { Accept: "application/json" },
      });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { throw new Error("Unexpected server response."); }
      if (!res.ok || json.status !== "success") throw new Error(json.message || `Error ${res.status}`);
      setData(json);
      setRewardAmt(json.current_reward_amount ?? 100);
    } catch (err) {
      setError(err.message || "Failed to load reward data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filter rewards
  const filtered = (data?.rewards || []).filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const term = query.toLowerCase();
    const matchesQuery = !term || [
      r.finder_name, r.finder_email, r.owner_name,
      r.lost_item_title, String(r.reward_id), r.status,
    ].some((v) => (v || "").toLowerCase().includes(term));
    return matchesStatus && matchesQuery;
  });

  // Action handlers
  const openModal = (reward, action) => {
    setPending({ reward, action });
    setTransRef("");
    setActionMsg("");
  };
  const closeModal = () => setPending(null);

  const confirmAction = async () => {
    if (!pending) return;
    setSaving(true);
    setActionMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/update_reward_status.php`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
        body:        JSON.stringify({
          reward_id:       pending.reward.reward_id,
          action:          pending.action,
          transaction_ref: transRef || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") throw new Error(json.message);
      setActionMsg(`Reward #${pending.reward.reward_id} marked as ${pending.action}.`);
      closeModal();
      fetchData(); // refresh
    } catch (err) {
      setActionMsg("❌ " + (err.message || "Action failed"));
    } finally {
      setSaving(false);
    }
  };

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
                Rewards Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Track and manage mobile reload rewards issued to finders on match verification.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search finder, item, ID…"
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* ── Error / loading ──────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}{" "}
            <button onClick={fetchData} className="ml-2 font-semibold underline">Retry</button>
          </div>
        )}
        {actionMsg && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            {actionMsg}
          </div>
        )}
        {loading && !data && (
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Loading reward data…</p>
          </div>
        )}

        {/* ── Stats grid ───────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Trophy}      label="Total Rewards"  value={stats.total_rewards}       colorClass="text-blue-600 bg-blue-50 border-blue-100" />
            <StatCard icon={Clock}       label="Pending"        value={stats.pending_count}        colorClass="text-amber-600 bg-amber-50 border-amber-100" />
            <StatCard icon={CheckCircle} label="Paid Out"       value={stats.paid_count}           colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" />
            <StatCard
              icon={DollarSign}
              label="Total Paid Out"
              value={formatRs(stats.total_paid_out)}
              colorClass="text-purple-600 bg-purple-50 border-purple-100"
            />
          </div>
        )}

        {data && (
          <div className="grid gap-6 lg:grid-cols-4">

            {/* ── Rewards table ────────────────────────────────────────────── */}
            <div className="lg:col-span-3">
              <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-6">

                {/* Filter row */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter:</span>
                  {["all", "pending", "paid", "cancelled"].map((s) => (
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
                  <span className="ml-auto text-[10px] text-slate-400">
                    {filtered.length} of {data.rewards.length} rewards
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">ID</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Finder</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Item Returned</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Amount</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Verified</th>
                        <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Gift className="h-8 w-8 text-slate-200" />
                              <p className="text-slate-400">
                                {query || statusFilter !== "all"
                                  ? "No rewards match your filters"
                                  : "No rewards yet — verify a match to create one"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((r) => (
                          <tr key={r.reward_id} className="hover:bg-slate-100/30 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-600">
                              #RWD-{r.reward_id}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-800">{r.finder_name}</p>
                              <p className="text-[10px] text-slate-400">{r.finder_email}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-700">{r.lost_item_title}</p>
                              <p className="text-[10px] text-slate-400">{r.lost_item_category}</p>
                            </td>
                            <td className="px-4 py-3 font-bold text-amber-600">
                              {formatRs(r.amount)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={r.status} />
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {formatDate(r.match_verified_at)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {r.status === "pending" && (
                                <div className="inline-flex gap-1.5">
                                  <button
                                    onClick={() => openModal(r, "paid")}
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-100"
                                  >
                                    Mark Paid
                                  </button>
                                  <button
                                    onClick={() => openModal(r, "cancelled")}
                                    className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-100"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {r.status === "paid" && (
                                <span className="text-[10px] text-slate-400">
                                  {r.transaction_ref || "Paid"}
                                </span>
                              )}
                              {r.status === "cancelled" && (
                                <span className="text-[10px] text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ── Sidebar: Amount config ───────────────────────────────────── */}
            <div className="space-y-4">
              <RewardAmountEditor current={rewardAmt} onSaved={setRewardAmt} />

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-xs font-bold text-slate-700">How It Works</p>
                <ul className="mt-2 space-y-2 text-[11px] text-slate-500">
                  <li>• Admin verifies a match in <em>Match Verification</em></li>
                  <li>• A reward row is auto-created for the <strong>finder</strong></li>
                  <li>• Amount comes from the setting above</li>
                  <li>• Admin sends mobile reload, then marks it as <strong>Paid</strong></li>
                  <li>• Finder can see their rewards in their dashboard</li>
                </ul>
              </div>

              {stats && (
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
                  <p className="text-xs font-bold text-slate-700">Payout Breakdown</p>
                  <div className="mt-3 space-y-2">
                    {[
                      { label: "Paid",      count: stats.paid_count,      color: "bg-emerald-500" },
                      { label: "Pending",   count: stats.pending_count,   color: "bg-amber-400"   },
                      { label: "Cancelled", count: stats.cancelled_count, color: "bg-slate-300"   },
                    ].map((s) => {
                      const pct = stats.total_rewards > 0
                        ? Math.round((s.count / stats.total_rewards) * 100)
                        : 0;
                      return (
                        <div key={s.label}>
                          <div className="mb-1 flex justify-between text-[10px] text-slate-600">
                            <span>{s.label}</span>
                            <span className="font-semibold">{s.count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100">
                            <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Confirm action modal */}
      {pending && (
        <ConfirmModal
          reward={pending.reward}
          action={pending.action}
          transRef={transRef}
          setTransRef={setTransRef}
          onConfirm={confirmAction}
          onCancel={closeModal}
          busy={saving}
        />
      )}
    </AdminLayout>
  );
}

export default ManageRewards;
