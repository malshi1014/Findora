import AdminLayout from "../../layouts/AdminLayout";
import { Search, AlertCircle, FileText, CheckCircle, ShieldAlert } from "lucide-react";

const stats = [
  { label: "Total Reports", value: "1,248", detail: "+12% from last month", icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-100" },
  { label: "Open Complaints", value: "42", detail: "Requires attention", icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-100" },
  { label: "Resolved Cases", value: "1,206", detail: "Closed successfully", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
];

const filters = ["All Reports", "User Reports", "Post Reports", "Abuse", "Spam", "Fake Information", "Claim Disputes", "Closed"];

const complaints = [
  { id: "9821", user: { name: "Kaveen", handle: "@malshi" }, content: "Report about suspicious post #SP-204...", status: "Investigating" },
  { id: "9818", user: { name: "Ishara", handle: "@omindu" }, content: "User posted incorrect item specifications...", status: "Pending" },
  { id: "9805", user: { name: "Kasuni", handle: "@navod" }, content: "Spam account reporting fake recovery reward...", status: "Resolved" },
];

const badgeClasses = {
  Investigating: "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-blue-50 text-blue-700 border-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
}

function ManageComplaints() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Findora Admin</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Complaints</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">Monitor and resolve community reports and platform complaints.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search ID, reporter..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.label} 
                className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md flex items-start gap-4"
              >
                <div className={`rounded-xl p-2.5 border ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{s.value}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{s.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complaints Table Box */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <ShieldAlert className="h-4 w-4 text-slate-400 self-center mr-1" />
              {filters.map((f) => (
                <button 
                  key={f} 
                  className={`rounded-full px-4 py-1.5 font-semibold transition ${f === 'All Reports' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-655 bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400 font-semibold">Showing 42 open items out of 1,248</div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="pb-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Report ID</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Reported User</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Content Description</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Status</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-semibold text-slate-700">#REP-{c.id}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-650 text-blue-600">
                          {c.user.name[0]}
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-xs">{c.user.name}</p>
                          <p className="text-[9px] text-slate-400">{c.user.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-700 max-w-sm truncate">{c.content}</td>
                    <td className="py-4 pr-4"><StatusBadge status={c.status} /></td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-655 text-slate-600 hover:bg-slate-50 transition">Investigate</button>
                        <button className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-600 hover:bg-emerald-100 transition">Resolve</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-5 font-semibold">
            <div>Page 1 of 42</div>
            <div className="space-x-1.5">
              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 transition">‹ Previous</button>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 transition">Next ›</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageComplaints;
