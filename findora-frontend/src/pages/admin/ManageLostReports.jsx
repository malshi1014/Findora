import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Lost Posts", value: "1,250", detail: "+12% this week" },
  { label: "Pending Approval", value: "42", detail: "Avg 4h review time" },
  { label: "Approved Posts", value: "980", detail: "+5% this week" },
  { label: "Recovered Cases", value: "228", detail: "+18% success rate" },
];

const tabs = [
  { label: "All Posts", count: null },
  { label: "Pending", count: 42 },
  { label: "Approved", count: null },
  { label: "Rejected", count: null },
  { label: "Recovered", count: null },
  { label: "Reported", count: null },
];

const reports = [
  {
    item: "Apple AirPods Pro",
    description: "White charging case",
    postId: "#LP-8942",
    category: "Electronics",
    location: "UWU Library",
    reporter: "Lakshan",
    date: "Oct 24, 2023 14:30 PM",
    status: "Pending",
  },
  {
    item: "Leather Wallet",
    description: "Match Found",
    postId: "#LP-8941",
    category: "Accessories",
    location: "Badulla Hospital",
    reporter: "Sarath",
    date: "Oct 24, 2023 09:15 AM",
    status: "Matched",
  },
  {
    item: "House Keys ",
    description: "Silver keys, leather fob",
    postId: "#LP-8938",
    category: "Personal Items",
    location: "Muthiyanganaya temple",
    reporter: "Sandun",
    date: "Oct 23, 2023 18:45 PM",
    status: "Approved",
  },
];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Matched: "bg-sky-100 text-sky-700",
  Approved: "bg-emerald-100 text-emerald-700",
};

function ManageLostReports() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                Findora Admin
              </p>
              <h1 className="mt-4 text-4xl font-semibold">Lost Posts Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Review and manage all reported lost item posts across the platform.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-sm">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                <input
                  type="search"
                  placeholder="Search ID, Category, User..."
                  className="w-full rounded-full border border-slate-800 bg-slate-900/90 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none focus:border-blue-500"
                />
              </div>
              
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
                <button
                  key={tab.label}
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
                >
                  {tab.label}
                  {tab.count !== null ? ` (${tab.count})` : ""}
                </button>
              ))}
            </div>
            <button className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
              Category
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Item</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Post ID</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category / Location</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Reported By</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Date</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reports.map((report) => (
                  <tr key={report.postId} className="border-t border-slate-800">
                    <td className="py-5 pr-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-3xl bg-slate-900/80" />
                        <div>
                          <p className="font-semibold text-white">{report.item}</p>
                          <p className="mt-1 text-xs text-slate-400">{report.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{report.postId}</td>
                    <td className="py-5 pr-6 text-slate-300">
                      <p>{report.category}</p>
                      <p className="mt-1 text-xs text-slate-400">{report.location}</p>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{report.reporter}</td>
                    <td className="py-5 pr-6 text-slate-300">{report.date}</td>
                    <td className="py-5 pr-6">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status] || "bg-slate-800 text-slate-300"}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-5 text-slate-300">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white">⋯</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <p>Showing 1 to 10 of 1,250 entries</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2">
              <button className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-slate-800">1</button>
              <button className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-slate-800">2</button>
              <button className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-slate-800">3</button>
              <button className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-slate-800">?</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageLostReports;
