import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Donations Received", value: "RS 124,500", detail: "+12.5% from last month" },
  { label: "Monthly Donations", value: "RS 12,400", detail: "+4.2% from last week" },
  { label: "Total Donors", value: "850", detail: "+24 new this month" },
];

const recent = [
  { id: "#DON-4822", name: "Alex Rivera", amount: "Rs 100.00", date: "Oct 24, 2025" },
  { id: "#DON-4821", name: "Sarah K.", amount: "Rs 500.00", date: "Oct 23, 2025" },
  { id: "#DON-4820", name: "Marcus Thorne", amount: "Rs 5000.00", date: "Oct 22, 2025" },
  { id: "#DON-4819", name: "Unknown User", amount: "Rs2500.00", date: "Oct 22, 2025" },
  { id: "#DON-4818", name: "Liam M.", amount: "Rs 2000.00", date: "Oct 21, 2025" },
];

const topDonors = [
  { name: "Sarah K.", amount: "Rs7,500" },
  { name: "Liam M.", amount: "Rs6,000" },
  { name: "Chen X.", amount: "Rs5,500" },
];

function ManageDonations() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
              <h1 className="mt-4 text-4xl font-semibold">Donation Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Manage and monitor all community donations.</p>
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

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] bg-slate-900/90 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-3 text-sm text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/40">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="col-span-2">
              <h3 className="text-white text-lg font-semibold">Donation Growth</h3>
              <div className="mt-4 h-48 rounded-lg bg-slate-900" />

              <div className="mt-8 rounded-[1.5rem] bg-slate-900 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold">Recent Donations</h4>
                  <a className="text-sm text-sky-400">View All →</a>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead>
                      <tr>
                        <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Donation ID</th>
                        <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Donor Name</th>
                        <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Amount</th>
                        <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {recent.map((r) => (
                        <tr key={r.id} className="border-t border-slate-800">
                          <td className="py-4 pr-6 text-slate-300">{r.id}</td>
                          <td className="py-4 pr-6 text-white">{r.name}</td>
                          <td className="py-4 pr-6 text-sky-400">{r.amount}</td>
                          <td className="py-4 text-slate-300">{r.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside>
              <div className="rounded-[1.5rem] bg-slate-900 p-4">
                <h4 className="text-sm text-slate-400">Top Donors</h4>
                <div className="mt-4 space-y-3">
                  {topDonors.map((d) => (
                    <div key={d.name} className="rounded-lg bg-slate-950/80 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{d.name}</p>
                        <p className="text-xs text-slate-400">Supporter</p>
                      </div>
                      <div className="text-sky-400 font-semibold">{d.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageDonations;
