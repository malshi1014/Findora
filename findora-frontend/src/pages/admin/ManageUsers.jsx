import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Users", value: "24,892", change: "+14%" },
  { label: "Active Users", value: "18,245", change: "+8.4%" },
  { label: "Disabled Users", value: "1,102", change: "-2.1%" },
  { label: "Verified Users", value: "14,320", change: "+6.7%" },
];

const users = [
  {
    name: "Malshi Navodya",
    role: "Premium Tier",
    id: "#FN-98218-A",
    email: "m@findora.tech",
    phone: "+94 77 123 4567",
    status: "Active",
    notifications: "Enabled",
  },
  {
    name: "Navod Teshan",
    role: "Standard",
    id: "#FN-44512-B",
    email: "n@findora.tech",
    phone: "+94 71 987 6543",
    status: "Disabled",
    notifications: "Off",
  },
  {
    name: "Omidu Sandew",
    role: "Enterprise",
    id: "#FN-11264-C",
    email: "o@findora.tech",
    phone: "+94 72 322 1188",
    status: "Reported",
    notifications: "Enabled",
  },
  {
    name: "Duvindu Weerathunga",
    role: "Enterprise",
    id: "#FN-11284-D",
    email: "d@findora.tech",
    phone: "+94 74 220 9851",
    status: "Active",
    notifications: "Enabled",
  },
];

const statusClasses = {
  Active: "bg-emerald-100 text-emerald-700",
  Disabled: "bg-rose-100 text-rose-700",
  Reported: "bg-amber-100 text-amber-700",
  Verified: "bg-sky-100 text-sky-700",
};

function ManageUsers() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                Findora Admin
              </p>
              <h1 className="mt-4 text-4xl font-semibold">Users Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Manage, monitor, and audit system users globally.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 px-5 py-3 text-sm text-slate-300 shadow-xl shadow-slate-950/20">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                  Search
                </span>
                <span className="text-xs font-semibold text-white">ID, Category, User...</span>
              </div>
              <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl hover:bg-blue-500">
                Add User
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] bg-slate-950/90 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <span className="mt-3 inline-flex rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
                {stat.change}
              </span>
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-3xl flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">??</span>
              <input
                type="text"
                placeholder="Search by Name, Email, or User ID..."
                className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none transition focus:border-blue-500"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">Last 30 Days</span>
              <button className="rounded-full border border-slate-800 px-3 py-2 text-slate-400 transition hover:border-slate-600 hover:text-white">
                ?
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">User ID</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Email & Phone</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Status</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Notifications</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-800">
                    <td className="py-5 pr-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 text-sm font-semibold text-white">
                          {user.name.split(" ").map((token) => token[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{user.id}</td>
                    <td className="py-5 pr-6 text-slate-300">
                      <p>{user.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.phone}</p>
                    </td>
                    <td className="py-5 pr-6">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[user.status] || "bg-slate-800 text-slate-300"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-5 pr-6 text-slate-300">{user.notifications}</td>
                    <td className="py-5 text-slate-300">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white">View</button>
                        <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white">Edit</button>
                        <button className="rounded-full bg-rose-600/10 px-3 py-2 text-rose-300 transition hover:bg-rose-600/20">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button className="rounded-full border border-slate-800 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white">
                Deactivate
              </button>
              <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
                Delete
              </button>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-slate-300">
              <span>1</span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span>2</span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span>3</span>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
