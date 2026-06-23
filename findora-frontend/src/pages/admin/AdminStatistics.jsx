import AdminLayout from "../../layouts/AdminLayout";

function AdminStatistics() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
            <h1 className="mt-4 text-4xl font-semibold">Statistics</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">View aggregated platform performance and analytics from the admin console.</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminStatistics;
