import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Users", value: "12,402", change: "+12%" },
  { label: "Active Reports", value: "1,248", change: "+8%" },
  { label: "Pending Claims", value: "452", change: "-3%" },
  { label: "Rewards Issued", value: "4,829", change: "+15%" },
];

const activityItems = [
  {
    label: "Alex Rivera registered as a new contributor.",
    time: "2 minutes ago",
    color: "text-blue-600",
  },
  {
    label: "New Gold Wallet report submitted.",
    time: "15 minutes ago",
    color: "text-purple-600",
  },
  {
    label: "Claim #CLM-8422 approved by system.",
    time: "1 hour ago",
    color: "text-teal-500",
  },
  {
    label: "Reward distributed to Maya Sterling.",
    time: "3 hours ago",
    color: "text-slate-500",
  },
];

const topContributors = [
  { name: "Sarah K.", title: "Expert", points: "2,480" },
  { name: "Liam M.", title: "Contributor", points: "1,920" },
  { name: "Chen X.", title: "Helper", points: "1,650" },
];

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                Findora Admin
              </p>
              <h1 className="mt-4 text-4xl font-semibold">Welcome Back, Admin</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Monitor platform activities and manage recovery operations from a single dashboard.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900/80 px-6 py-4 text-sm text-slate-300 shadow-xl shadow-slate-900/20">
              <p className="font-semibold text-slate-100">June 19, 2026</p>
              <p className="mt-1 text-slate-500">Live analytics updated in real time</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.75rem] bg-white p-6 shadow-xl shadow-slate-200/60">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
                  <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>

            <section className="rounded-[2rem] bg-slate-950/90 p-8 text-white shadow-2xl shadow-slate-900/30">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    Recovery Performance
                  </p>
                  <h2 className="mt-4 text-4xl font-semibold">82%</h2>
                  <p className="mt-3 max-w-xl text-sm text-slate-300">
                    Platform-wide success metrics over the last 30 days.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 px-5 py-4 text-center">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Success Rate</p>
                  <p className="mt-3 text-3xl font-semibold text-sky-400">82%</p>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-[1.75rem] bg-slate-900/80 p-4">
                <svg viewBox="0 0 600 220" className="h-48 w-full">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 160 C 120 120 180 140 260 110 S 420 80 500 100 T 580 90"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="160" r="5" fill="#38bdf8" />
                  <circle cx="260" cy="110" r="5" fill="#7c3aed" />
                  <circle cx="580" cy="90" r="5" fill="#38bdf8" />
                </svg>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-slate-400">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">January</p>
                  <p className="mt-2">Stable recovery pace</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">April</p>
                  <p className="mt-2">Noticeable lift after campaign</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">June</p>
                  <p className="mt-2">Target met 4th week</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Recent Activity</p>
                  <p className="mt-2 text-xs text-slate-400">Latest actions from the platform</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  4 updates
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {activityItems.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className={`mt-2 text-xs font-semibold ${item.color}`}>{item.time}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] bg-slate-950/90 p-6 text-white shadow-2xl shadow-slate-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Summary</p>
                  <h3 className="mt-3 text-3xl font-semibold">Top Contributors</h3>
                </div>
                <div className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  View full rankings
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {topContributors.map((contributor) => (
                  <div key={contributor.name} className="rounded-3xl bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{contributor.name}</p>
                        <p className="text-xs text-slate-400">{contributor.title}</p>
                      </div>
                      <p className="text-sm font-semibold text-sky-400">{contributor.points} pts</p>
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
