import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function ReportSuspiciousItem() {
  const navigate = useNavigate();
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details || !location || !contact) {
      setError("Please complete all fields before submitting.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Suspicious activity report submitted.");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Alert</p>
              <h1 className="mt-4 text-4xl font-semibold">Report Suspicious Item</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Notify the team about suspicious items or behavior so we can investigate and protect the community.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-slate-950/95 p-8 shadow-2xl shadow-slate-900/40">
          {error && <div className="mb-6 rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <div className="grid gap-6">
            <label className="grid gap-2 text-sm text-slate-300">
              Description of Suspicious Item
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Describe the suspicious item, location, or activity."
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              Location or Context
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Where did you notice it?"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              Contact Information
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Email or phone so we can follow up"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default ReportSuspiciousItem;
