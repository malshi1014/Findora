import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem("findora_user")); }
  catch { return null; }
};
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

// ── Preset amounts ────────────────────────────────────────────────────────────
const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

// ── PayHere redirect helper ───────────────────────────────────────────────────
function redirectToPayHere(checkoutUrl, params) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = checkoutUrl;
  Object.entries(params).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type  = "hidden";
    input.name  = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  failed:    "bg-red-50 text-red-700 border-red-100",
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

// ── Tab button ────────────────────────────────────────────────────────────────
function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

// ── Donation History sub-component ────────────────────────────────────────────
function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/donations/get_donations.php`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { throw new Error("Unexpected server response"); }
      if (!res.ok || json.status !== "success") throw new Error(json.message || `Error ${res.status}`);
      setDonations(json.donations || []);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="mt-4 text-sm text-slate-500">Loading your donation history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}{" "}
        <button onClick={fetchHistory} className="ml-1 font-semibold underline">Retry</button>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-5xl">💙</span>
        <p className="font-semibold text-slate-700">No donations yet</p>
        <p className="text-sm text-slate-500">
          Switch to the <strong>Make a Donation</strong> tab to start supporting the community.
        </p>
      </div>
    );
  }

  const completedTotal = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Donated",    value: formatRs(completedTotal), color: "text-blue-700" },
          { label: "Donations Made",   value: donations.filter((d) => d.status === "completed").length, color: "text-emerald-700" },
          { label: "Pending",          value: donations.filter((d) => d.status === "pending").length,   color: "text-amber-700"   },
          { label: "All Transactions", value: donations.length,                                          color: "text-slate-800"   },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">ID</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Donated As</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Amount</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-slate-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {donations.map((d) => (
              <tr key={d.donation_id} className="hover:bg-slate-100/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-600">#DON-{d.donation_id}</td>
                <td className="px-4 py-3 text-slate-800">
                  {d.is_anonymous ? (
                    <span className="text-slate-400 italic">Anonymous</span>
                  ) : (
                    d.donor_name || "—"
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-blue-600">{formatRs(d.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-right text-slate-500">
                  {formatDate(d.donation_date || d.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function Donation() {
  const location    = useLocation();
  const formRef     = useRef(null);
  const currentUser = getCurrentUser();

  const [activeTab,    setActiveTab]    = useState("donate"); // "donate" | "history"
  const [amount,       setAmount]       = useState(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName,    setDonorName]    = useState(
    currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : ""
  );
  const [donorEmail,  setDonorEmail]   = useState(currentUser?.email || "");
  const [anonymous,   setAnonymous]    = useState(false);
  const [loading,     setLoading]      = useState(false);
  const [error,       setError]        = useState("");
  const [paymentResult, setPaymentResult] = useState(null); // "success" | "cancelled" | null

  // Parse return-URL query params from PayHere redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");
    if (payment === "success")   { setPaymentResult("success");   setActiveTab("history"); }
    if (payment === "cancelled") { setPaymentResult("cancelled"); }
  }, [location.search]);

  const choosePreset = (val) => { setAmount(val); setCustomAmount(""); };
  const handleCustomChange = (e) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(v);
    if (v) setAmount(Number(v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!currentUser) { setError("You must be logged in to donate."); return; }
    if (amount < 100) { setError("Minimum donation amount is Rs. 100."); return; }
    if (!donorName.trim()) { setError("Please enter your name."); return; }
    if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      setError("Please enter a valid email address."); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/donations/initiate_donation.php`, {
        method:      "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
        body: JSON.stringify({ amount, donor_name: donorName.trim(), donor_email: donorEmail.trim(), is_anonymous: anonymous }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Unexpected server response. Please try again."); }
      if (!res.ok || data.status !== "success") throw new Error(data.message || `Server error (${res.status})`);
      redirectToPayHere(data.checkout_url, data.params);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (paymentResult === "success") {
    return (
      <RoleBasedLayout>
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl bg-white p-12 shadow-2xl shadow-emerald-300/20 ring-1 ring-emerald-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-950">Thank you! 💙</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your donation has been received and is being processed by PayHere. A receipt will be
              sent to your email shortly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => { setPaymentResult(null); setActiveTab("history"); }}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View My Donations
              </button>
              <button
                onClick={() => setPaymentResult(null)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Donate Again
              </button>
            </div>
          </div>
        </div>
      </RoleBasedLayout>
    );
  }

  // ── Cancelled screen ───────────────────────────────────────────────────────
  if (paymentResult === "cancelled") {
    return (
      <RoleBasedLayout>
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl bg-white p-12 shadow-2xl shadow-amber-300/20 ring-1 ring-amber-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-950">Payment Cancelled</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your donation was cancelled. No payment has been taken. You can try again whenever
              you&apos;re ready.
            </p>
            <button
              onClick={() => setPaymentResult(null)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </RoleBasedLayout>
    );
  }

  // ── Main page ──────────────────────────────────────────────────────────────
  return (
    <RoleBasedLayout>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Hero banner */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 shadow-xl shadow-blue-300/30">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Our Cause</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Support Our Mission</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                Your contribution helps us reunite families, find beloved pets, and return precious
                belongings. Together we build a safer, more connected community.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-2 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Secured by</p>
              <p className="text-xl font-bold text-white">PayHere</p>
              <p className="text-xs text-blue-200">Sandbox Mode</p>
            </div>
          </div>
        </section>

        {/* Tab switcher */}
        <div className="flex gap-2">
          <Tab active={activeTab === "donate"}  onClick={() => setActiveTab("donate")}>Make a Donation</Tab>
          <Tab active={activeTab === "history"} onClick={() => setActiveTab("history")}>My Donation History</Tab>
        </div>

        {/* ── Donation form tab ──────────────────────────────────────────── */}
        {activeTab === "donate" && (
          <div className="grid gap-6 lg:grid-cols-5">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md md:p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <p className="text-base font-bold text-slate-800">Complete Your Donation</p>

                  {/* Amount selection */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-600">Select an amount (LKR)</p>
                    <div className="flex flex-wrap gap-3">
                      {PRESET_AMOUNTS.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => choosePreset(a)}
                          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                            amount === a && !customAmount
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Rs {a.toLocaleString()}
                        </button>
                      ))}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setCustomAmount(""); setAmount(0); }}
                          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                            customAmount ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Custom
                        </button>
                        <input
                          type="text"
                          placeholder="Amount"
                          value={customAmount}
                          onChange={handleCustomChange}
                          className="w-28 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {amount >= 100 && (
                      <p className="mt-3 text-sm font-semibold text-blue-700">
                        Donating: Rs {amount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Donor details */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        placeholder="Receipt will be sent here"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                  </div>

                  {/* Anonymous toggle */}
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={() => setAnonymous(!anonymous)}
                      className="h-4 w-4 rounded accent-blue-600"
                    />
                    Donate anonymously (your name won&apos;t be shown publicly)
                  </label>

                  {/* PayHere info */}
                  <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-800">
                    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>
                      Clicking <strong>Proceed to Payment</strong> will redirect you to the{" "}
                      <strong>PayHere Sandbox</strong> secure checkout page.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || amount < 100}
                    className="mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Preparing Checkout…
                      </>
                    ) : (
                      <>
                        Proceed to Payment — Rs {(amount || 0).toLocaleString()}
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* How donation is used */}
              <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-bold text-slate-800">How Your Donation Is Used</h3>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Platform Maintenance", pct: 45, color: "bg-blue-600" },
                    { label: "Community Campaigns",  pct: 35, color: "bg-purple-400" },
                    { label: "Emergency Grants",     pct: 20, color: "bg-slate-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex justify-between text-xs text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-bold text-slate-800">FAQ</h3>
                <div className="mt-4 space-y-2">
                  {[
                    { q: "Is my donation secure?",          a: "Yes. All payments are processed by PayHere. Findora never stores your card details." },
                    { q: "Which payment methods accepted?", a: "PayHere supports Visa, Mastercard, Amex, eZCash, mCash, and most Sri Lankan bank cards." },
                    { q: "Can I cancel a donation?",        a: "Donations are one-time payments and cannot be reversed after completion." },
                  ].map((faq) => (
                    <details key={faq.q} className="rounded-xl border border-slate-100 p-3">
                      <summary className="cursor-pointer text-xs font-semibold text-slate-700">{faq.q}</summary>
                      <p className="mt-2 text-xs text-slate-500">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── History tab ────────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-md md:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-950">My Donation History</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                All your PayHere donations — latest first
              </p>
            </div>
            <div className="mt-5">
              <DonationHistory />
            </div>
          </section>
        )}

      </div>
    </RoleBasedLayout>
  );
}

export default Donation;