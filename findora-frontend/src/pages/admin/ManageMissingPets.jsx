import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Lost Posts", value: "1,250", detail: "+12% this week" },
  { label: "Pending Approval", value: "42", detail: "Avg 4h review time" },
  { label: "Approved Posts", value: "980", detail: "+5% this week" },
  { label: "Recovered Cases", value: "228", detail: "+18% success rate" },
];

const pets = [
  { name: "Luna", sex: "Female", age: "3 Years", id: "9821", type: "Dog", breed: "Golden Retriever", reporter: "Sarah Jenkins", location: "San Francisco", status: "Verified" },
  { name: "Max", sex: "Male", age: "1 Year", id: "8842", type: "Dog", breed: "Husky", reporter: "David Chen", location: "Seattle", status: "Pending" },
  { name: "Oliver", sex: "Male", age: "5 Years", id: "7712", type: "Cat", breed: "Bombay", reporter: "Marcus Roe", location: "London", status: "Matched" },
];

const statusClasses = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Matched: "bg-sky-100 text-sky-700",
};

function ManageMissingPets() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
              <h1 className="mt-4 text-4xl font-semibold">Lost Pets Posts Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Review and manage all reported lost pet posts across the platform.</p>
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
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Pet Details</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Post ID</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Type & Breed</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Reported By</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Location</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pets.map((p) => (
                  <tr key={p.id} className="border-t border-slate-800">
                    <td className="py-5 pr-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-3xl bg-slate-800" />
                        <div>
                          <p className="font-semibold text-white">{p.name} <span className="text-xs text-slate-400">{p.sex} • {p.age}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{p.id}</td>
                    <td className="py-5 pr-6 text-slate-300">{p.type} • {p.breed}</td>
                    <td className="py-5 pr-6 text-slate-300">{p.reporter}</td>
                    <td className="py-5 pr-6 text-slate-300">{p.location}</td>
                    <td className="py-5 pr-6">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[p.status] || 'bg-slate-800 text-slate-300'}`}>{p.status}</span>
                    </td>
                    <td className="py-5 text-slate-300">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="rounded-full px-4 py-2 text-sm text-slate-300 border border-slate-800 hover:bg-slate-800">Previous</button>
            <button className="rounded-full px-4 py-2 text-sm bg-blue-600 text-white hover:opacity-95">Next</button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageMissingPets;
