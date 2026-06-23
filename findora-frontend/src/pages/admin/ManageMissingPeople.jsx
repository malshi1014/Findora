import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Cases", value: "248", detail: "+12%" },
  { label: "Active Cases", value: "42", detail: "Critical" },
  { label: "Verified Reports", value: "185", detail: "94%" },
  { label: "Resolved (YTD)", value: "1,420", detail: "Success" },
];

const tabs = ["All Cases", "Pending Verification", "Verified", "Resolved"];

const cases = [
  { id: "9821", name: "Alex Rivera", age: "24 years old", reporter: "Maria Rivera (Mother)", lastSeen: "Central Park, NY", priority: "Emergency", status: "Searching" },
  { id: "8842", name: "Sarah Jenkins", age: "72 years old", reporter: "Staff @ Green Care", lastSeen: "Oakwood Station", priority: "High", status: "Verifying" },
  { id: "9118", name: "Emily Zhao", age: "8 years old", reporter: "David Zhao (Father)", lastSeen: "Downtown Mall", priority: "Emergency", status: "Broadcasting" },
];

const priorityClasses = {
  Emergency: "bg-rose-100 text-rose-700",
  High: "bg-amber-100 text-amber-700",
  Normal: "bg-slate-100 text-slate-700",
};

function ManageMissingPeople() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
              <h1 className="mt-4 text-4xl font-semibold">Missing People Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Review and manage missing and found people reports with AI-powered match verification.</p>
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
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] bg-blue-950/95 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-3 text-sm text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button key={tab} className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400">Advanced Filters</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Photo & ID</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Name / Age</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Reporter</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Last Seen</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Priority</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cases.map((c) => (
                  <tr key={c.id} className="border-t border-slate-800">
                    <td className="py-5 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800" />
                        <div className="text-slate-300">{c.id}</div>
                      </div>
                    </td>
                    <td className="py-5 pr-6">
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{c.age}</p>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{c.reporter}</td>
                    <td className="py-5 pr-6 text-slate-300">{c.lastSeen}</td>
                    <td className="py-5 pr-6">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[c.priority] || 'bg-slate-800 text-slate-300'}`}>{c.priority}</span>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{c.status}</td>
                    <td className="py-5 text-slate-300">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 hover:bg-slate-800">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-slate-400 flex items-center justify-between">
            <div>Showing 1-10 of 42 active cases</div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2">
              <button className="rounded-full px-3 py-2 text-slate-300">Prev</button>
              <button className="rounded-full px-3 py-2 text-slate-300">1</button>
              <button className="rounded-full px-3 py-2 text-slate-300">2</button>
              <button className="rounded-full px-3 py-2 text-slate-300">Next</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageMissingPeople;
