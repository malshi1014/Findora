import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";
import { Search, AlertCircle, FileText, CheckCircle, ShieldAlert, X, Send, CornerDownRight } from "lucide-react";

const badgeClasses = {
  Reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-blue-50 text-blue-700 border-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

function StatusBadge({ status }) {
  const normStatus = status || 'Pending';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses[normStatus] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {normStatus}
    </span>
  );
}

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Selected complaint for Investigate / Reply modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("resolved");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/admin/get_complaints.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.status === "success") {
        setComplaints(data.complaints || []);
        setStats(data.stats || { total: 0, open: 0, resolved: 0 });
      } else {
        setError(data.message || "Failed to load complaints.");
      }
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setError("Network error loading complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReplyMessage(complaint.admin_reply || "");
    setReplyStatus(complaint.status?.toLowerCase() === "resolved" ? "resolved" : "resolved");
  };

  const handleCloseReplyModal = () => {
    setSelectedComplaint(null);
    setReplyMessage("");
    setIsSubmittingReply(false);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !replyMessage.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reply_complaint.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          complaint_id: selectedComplaint.id,
          admin_reply: replyMessage.trim(),
          status: replyStatus,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        handleCloseReplyModal();
        fetchComplaints(); // Refresh list & stats
      } else {
        alert(data.message || "Failed to send reply.");
      }
    } catch (err) {
      console.error("Send reply error:", err);
      alert("Network error sending reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const filterOptions = ["All", "Pending", "Reviewing", "Resolved", "Rejected"];

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter =
      activeFilter === "All" || c.status?.toLowerCase() === activeFilter.toLowerCase();

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.id.toString().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const statCards = [
    { label: "Total Complaints", value: stats.total, detail: "All platform messages", icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Open Complaints", value: stats.open, detail: "Requires admin response", icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Resolved Cases", value: stats.resolved, detail: "Answered successfully", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Findora Admin</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Complaint Management</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">Monitor, investigate, and reply to user inquiries & community complaints in real-time.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, user, subject..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Real-time Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((s) => {
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
              {filterOptions.map((f) => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-full px-4 py-1.5 font-semibold transition ${activeFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              Showing {filteredComplaints.length} of {complaints.length} total items
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">Loading live complaints...</div>
          ) : error ? (
            <div className="py-8 text-center text-xs text-rose-500 font-medium">{error}</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">No complaints found.</div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-xs">
                <thead>
                  <tr>
                    <th className="pb-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">ID</th>
                    <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Reporter</th>
                    <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Subject & Message</th>
                    <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Status</th>
                    <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Date</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-semibold text-slate-700">#CMP-{c.id}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                            {c.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-xs">{c.name}</p>
                            <p className="text-[10px] text-slate-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 max-w-xs">
                        <p className="font-semibold text-slate-900 text-xs truncate">{c.subject}</p>
                        <p className="text-slate-600 text-[11px] truncate mt-0.5">{c.message}</p>
                        {c.admin_reply && (
                          <div className="mt-1.5 flex items-start gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                            <CornerDownRight className="h-3 w-3 shrink-0 mt-0.5" />
                            <span className="truncate">Reply: {c.admin_reply}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 pr-4"><StatusBadge status={c.status} /></td>
                      <td className="py-4 pr-4 text-slate-500 text-[11px]">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleOpenReplyModal(c)}
                          className="rounded-full bg-blue-600 px-3.5 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider hover:bg-blue-700 transition"
                        >
                          {c.admin_reply ? "View / Edit Reply" : "Investigate & Reply"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Investigate & Reply Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Complaint #CMP-{selectedComplaint.id}</h3>
                  <p className="text-xs text-slate-500">Submitted by {selectedComplaint.name} ({selectedComplaint.email})</p>
                </div>
                <button 
                  onClick={handleCloseReplyModal}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
                  <p className="font-semibold text-slate-900 mb-1">Subject: {selectedComplaint.subject}</p>
                  <p className="text-slate-700 leading-relaxed">{selectedComplaint.message}</p>
                  <p className="mt-2 text-[10px] text-slate-400">Date: {new Date(selectedComplaint.created_at).toLocaleString()}</p>
                </div>

                <form onSubmit={handleSendReply} className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Admin Response / Reply Message</label>
                    <textarea
                      rows="4"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your official reply to the user..."
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Update Status</label>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 transition"
                    >
                      <option value="resolved">Resolved (Closed)</option>
                      <option value="reviewing">Reviewing (Investigating)</option>
                      <option value="rejected">Rejected</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCloseReplyModal}
                      className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyMessage.trim()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {isSubmittingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageComplaints;
