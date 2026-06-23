import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Reports", value: "1,248", detail: "+12%" },
  { label: "Open Complaints", value: "42", detail: "High Priority" },
  { label: "Resolved Cases", value: "1,185", detail: "" },
];

const filters = ["All Reports", "User Reports", "Post Reports", "Abuse", "Spam", "Fake Information", "Claim Disputes", "Closed"];

const complaints = [
  { id: "9821", user: { name: "Julian Vance", handle: "@julian_v" }, content: "Report about suspicious post...", status: "Investigating" },
  { id: "9818", user: { name: "Elena Rossi", handle: "@elena_rossi" }, content: "User posted incorrect info...", status: "Pending" },
  { id: "9805", user: { name: "Marcus King", handle: "@mking_lux" }, content: "Spam account reporting...", status: "Resolved" },
];

function StatusBadge({ status }) {
  const map = {
    Investigating: "bg-amber-500/10 text-amber-300",
    Pending: "bg-sky-500/10 text-sky-300",
    Resolved: "bg-emerald-500/10 text-emerald-300",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${map[status] || 'bg-slate-800 text-slate-300'}`}>{status}</span>;
}

function ManageComplaints() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
              <h1 className="mt-4 text-4xl font-semibold">Complaints</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Monitor and resolve community reports and platform complaints.</p>
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

        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[1.25rem] bg-slate-900/90 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{s.value}</p>
              {s.detail && <p className="mt-2 text-sm text-slate-400">{s.detail}</p>}
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f} className={`rounded-full px-4 py-2 text-xs font-semibold ${f === 'All Reports' ? 'bg-sky-500 text-white' : 'bg-slate-900/80 text-slate-300'}`}>{f}</button>
              ))}
            </div>
            <div className="text-sm text-slate-400">Showing 42 open items out of 1,248</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Report ID</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Reported User</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Content</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {complaints.map((c) => (
                  <tr key={c.id} className="border-t border-slate-800">
                    <td className="py-5 pr-6 font-semibold text-slate-100">{c.id}</td>
                    <td className="py-5 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800/60" />
                        <div>
                          <p className="text-white font-semibold">{c.user.name}</p>
                          <p className="text-xs text-slate-500">{c.user.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{c.content}</td>
                    <td className="py-5"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <div>Page 1 of 42</div>
            <div className="space-x-2">
              <button className="rounded-full bg-slate-900/80 px-3 py-1">‹</button>
              <button className="rounded-full bg-slate-900/80 px-3 py-1">›</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageComplaints;
