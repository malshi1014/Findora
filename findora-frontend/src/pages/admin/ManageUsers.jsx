import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";
import { Users, Search, ShieldAlert, BadgeCheck, UserPlus, Filter, RefreshCw } from "lucide-react";

const initialStats = [
  { label: "Total Users", value: "24,892", change: "+14%", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
  { label: "Active Users", value: "18,245", change: "+8.4%", icon: BadgeCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { label: "Reported Users", value: "1,102", change: "-2.1%", icon: ShieldAlert, color: "text-amber-600 bg-amber-50 border-amber-100" },
  { label: "Verified Users", value: "14,320", change: "+6.7%", icon: UserPlus, color: "text-sky-600 bg-sky-50 border-sky-100" },
];

const initialUsers = [
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
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Disabled: "bg-rose-50 text-rose-700 border-rose-200",
  Reported: "bg-amber-50 text-amber-700 border-amber-200",
  Verified: "bg-sky-50 text-sky-700 border-sky-200",
};

function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.id.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    
    if (filterType === "All") return matchesSearch;
    return matchesSearch && user.status === filterType;
  });

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                Findora Admin
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Users Management</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Manage, monitor, and audit system users globally.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-500">
                <span className="font-bold text-slate-400">STATUS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700">Audit Live</span>
              </div>
              <button className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all">
                Add New User
              </button>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {initialStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md flex items-start gap-4"
              >
                <div className={`rounded-xl p-2.5 border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{stat.value}</p>
                  <span className="mt-1 inline-flex text-[10px] font-bold text-blue-600">
                    {stat.change} vs last month
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Users Table Section */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
            {/* Search Input */}
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by Name, Email, or User ID..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
              {["All", "Active", "Disabled", "Reported"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterType(status)}
                  className={`rounded-full px-4 py-1.5 font-semibold transition ${
                    filterType === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Profile</th>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">User ID</th>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Email & Phone</th>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Status</th>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Notifications</th>
                  <th className="pb-4 pt-5 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-xs font-bold text-white shadow-xs">
                          {user.name.split(" ").map((token) => token[0]).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-slate-700">{user.id}</td>
                    <td className="py-4 pr-4 text-slate-650 text-slate-600">
                      <p>{user.email}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{user.phone}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses[user.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{user.notifications}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition">View</button>
                        <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition">Edit</button>
                        <button className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-600 hover:bg-rose-100 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-5">
            <div className="flex gap-2">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                Bulk Deactivate
              </button>
              <button className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition">
                Bulk Delete
              </button>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs text-slate-500">
              <button className="font-semibold text-slate-900">1</button>
              <span className="h-1 w-1 rounded-full bg-slate-350 bg-slate-300" />
              <button className="hover:text-slate-800">2</button>
              <span className="h-1 w-1 rounded-full bg-slate-350 bg-slate-300" />
              <button className="hover:text-slate-800">3</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
