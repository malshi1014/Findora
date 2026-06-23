import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Rewards Issued", value: "4,829 units", badge: "+2.4%" },
  { label: "Eligible Users", value: "1,120", badge: "+3.8%" },
  { label: "Pending Approvals", value: "142", badge: "Action Req" },
  { label: "Completed Payouts", value: "98.2%", badge: "Stable" },
];

const queue = [
  { id: "UR-001", name: "Maya Sterling", handle: "maya.s", recoveries: 4, level: "Level 3", status: "Eligible" },
  { id: "UR-002", name: "Liam Carter", handle: "liam.c", recoveries: 2, level: "Level 2", status: "Pending" },
  { id: "UR-003", name: "Dr. Silas Thorne", handle: "s.thorne", recoveries: 6, level: "Level 6", status: "Issued" },
];

function StatusPill({ status }) {
  const map = {
    Eligible: "bg-emerald-500/10 text-emerald-300",
    Pending: "bg-amber-500/10 text-amber-300",
    Issued: "bg-sky-500/10 text-sky-300",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${map[status] || 'bg-slate-800 text-slate-300'}`}>{status}</span>;
}

function ManageRewards() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
              <h1 className="mt-4 text-4xl font-semibold">Rewards Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Manage community incentives and user achievements with AI-assisted allocation.</p>
            </div>

            <div className="relative w-full max-w-sm">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input
                type="search"
                placeholder="Search ID, Category, User..."
                className="w-full rounded-full border border-slate-800 bg-slate-900/90 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[1.75rem] bg-slate-900/90 p-6 shadow-xl shadow-slate-900/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{s.value}</p>
                  <p className="mt-3 text-sm text-slate-400">{s.badge}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/40">
          <h3 className="text-white text-lg font-semibold">Eligible Users Queue</h3>
          <div className="mt-4 rounded-[1.5rem] bg-slate-900/90 p-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm text-slate-300">
                <thead>
                  <tr>
                    <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">User</th>
                    <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recoveries</th>
                    <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Current Level</th>
                    <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                    <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {queue.map((u) => (
                    <tr key={u.id} className="border-t border-slate-800">
                      <td className="py-5 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-800/60" />
                          <div>
                            <p className="text-white font-semibold">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.handle} • {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 pr-6 text-slate-300">{u.recoveries} items</td>
                      <td className="py-5 pr-6">
                        <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300">{u.level}</span>
                      </td>
                      <td className="py-5 pr-6"><StatusPill status={u.status} /></td>
                      <td className="py-5 text-slate-300">
                        <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 hover:bg-slate-800">→</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-slate-500">Showing 1-10 of 1,120 users</div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageRewards;
