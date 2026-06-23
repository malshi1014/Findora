import AdminLayout from "../../layouts/AdminLayout";

const stats = [
  { label: "Total Found Posts", value: "1,420", detail: "+12%" },
  { label: "Pending Verification", value: "28", detail: "-4%" },
  { label: "Approved Posts", value: "1,350", detail: "+8%" },
  { label: "Successfully Returned", value: "890", detail: "+22%" },
];

const tabs = [
  "All Posts",
  "Pending",
  "Verified",
  "Approved",
  "Matched",
  "Returned",
  "Reported",
];

const posts = [
  {
    image: "",
    postId: "#FP-9012",
    title: "Apple AirPods Pro",
    category: "Electronics",
    reporter: "Marcus Chen",
    foundLocation: "Central Park",
    dateFound: "Oct 24, 2023",
    status: "Verified",
  },
  {
    image: "",
    postId: "#FP-9013",
    title: "Leather Wallet",
    category: "Personal",
    reporter: "Sarah Miller",
    foundLocation: "Grand Central",
    dateFound: "Oct 23, 2023",
    status: "Pending",
  },
];

const statusStyles = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Matched: "bg-sky-100 text-sky-700",
  Returned: "bg-cyan-100 text-cyan-700",
  Reported: "bg-slate-100 text-slate-700",
};

function ManageFoundReports() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                Findora Admin
              </p>
              <h1 className="mt-4 text-4xl font-semibold">Found Posts Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Review and manage all found item reports.
              </p>
            </div>

            <div className="relative w-full max-w-sm">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">??</span>
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
                <button
                  key={tab}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    tab === "Approved"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[940px] border-separate border-spacing-y-3 text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Image</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Post ID</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Title</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Reported By</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Found Location</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Date Found</th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.postId} className="rounded-[1.5rem] bg-slate-900/80 shadow-sm shadow-slate-950/20">
                    <td className="py-5 pr-6 align-middle">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-slate-300">
                        Img
                      </div>
                    </td>
                    <td className="py-5 pr-6 align-middle font-semibold text-white">{post.postId}</td>
                    <td className="py-5 pr-6 align-middle font-semibold text-white">{post.title}</td>
                    <td className="py-5 pr-6 align-middle text-slate-300">{post.category}</td>
                    <td className="py-5 pr-6 align-middle text-slate-300">{post.reporter}</td>
                    <td className="py-5 pr-6 align-middle text-slate-300">{post.foundLocation}</td>
                    <td className="py-5 pr-6 align-middle text-slate-300">{post.dateFound}</td>
                    <td className="py-5 pr-6 align-middle">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[post.status]}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-5 align-middle">
                      <button className="rounded-full bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageFoundReports;
