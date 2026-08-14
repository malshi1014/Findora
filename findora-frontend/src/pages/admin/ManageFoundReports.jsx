import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";
import { Search, Filter, RefreshCw, Eye } from "lucide-react";
import ImagePreviewModal from "../../components/Admin/ImagePreviewModal";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  matched: "bg-sky-50 text-sky-700 border-sky-200",
};

function ManageFoundReports() {
  const [foundReports, setFoundReports] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("findora_user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const fetchFoundReports = async (silent = false) => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      setError("Admin login required.");
      setLoading(false);
      return;
    }

    try {
      if (!silent) {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/get_all_reports.php?admin_id=${user.user_id}&status=all`
      );

      const text = await response.text();
      console.log("Raw found reports response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      if (data.status === "success") {
        const onlyFoundReports = (data.reports || []).filter(
          (item) => item.report_type === "found"
        );

        setFoundReports(onlyFoundReports);
      } else {
        setError(data.message || "Failed to load found reports.");
      }
    } catch (err) {
      console.error("Found reports loading error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_all_reports.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoundReports();

    const intervalId = setInterval(() => {
      fetchFoundReports(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const updateReportStatus = async (report, newStatus) => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      alert("Admin login required.");
      return;
    }

    if (report.status === "matched") {
      alert("Matched/recovered reports cannot be changed.");
      return;
    }

    if (report.status === newStatus) {
      alert(`This report is already ${newStatus}.`);
      return;
    }

    const confirmAction = window.confirm(
      `Are you sure you want to mark this found report as ${newStatus}?`
    );

    if (!confirmAction) {
      return;
    }

    setUpdatingId(report.report_id);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/update_report_status.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: user.user_id,
            report_id: report.report_id,
            report_type: "found",
            status: newStatus,
          }),
        }
      );

      const text = await response.text();
      console.log("Raw found report status update response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      if (data.status === "success") {
        setFoundReports((prevReports) =>
          prevReports.map((item) =>
            item.report_id === report.report_id
              ? { ...item, status: newStatus }
              : item
          )
        );

        alert("Found report status updated successfully.");
      } else {
        alert(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to update report."
        );
      }
    } catch (err) {
      console.error("Found report update error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check update_report_status.php."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "active") return "Approved";
    if (status === "rejected") return "Rejected";
    if (status === "matched") return "Recovered";
    return status || "Unknown";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    return `${API_BASE_URL}/${imagePath}`;
  };

  const filteredReports = useMemo(() => {
    let result = [...foundReports];

    if (activeTab !== "all") {
      result = result.filter((item) => item.status === activeTab);
    }

    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();

      result = result.filter((item) => {
        const searchableText = [
          item.report_id,
          item.title,
          item.category,
          item.location,
          item.district,
          item.user_name,
          item.user_email,
          item.contact_no,
          item.description,
          item.unique_identifiers,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    return result;
  }, [foundReports, activeTab, searchText]);

  const stats = [
    {
      label: "Total Found Posts",
      value: foundReports.length,
      detail: "All submitted found item reports",
    },
    {
      label: "Pending Approval",
      value: foundReports.filter((item) => item.status === "pending").length,
      detail: "Waiting for admin review",
    },
    {
      label: "Approved Posts",
      value: foundReports.filter((item) => item.status === "active").length,
      detail: "Visible for matching process",
    },
    {
      label: "Recovered Cases",
      value: foundReports.filter((item) => item.status === "matched").length,
      detail: "Successfully matched reports",
    },
  ];

  const tabs = [
    { label: "All Posts", key: "all" },
    { label: "Pending", key: "pending" },
    { label: "Approved", key: "active" },
    { label: "Rejected", key: "rejected" },
    { label: "Recovered", key: "matched" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto mt-12">
          <h3 className="text-lg font-bold text-red-800">Connection Failed</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={() => fetchFoundReports()}
            className="mt-5 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

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
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Found Posts Management
              </h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Review, approve, reject and monitor all found item reports submitted by users.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search ID, finder, location..."
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => fetchFoundReports()}
                className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2.5 text-2xl font-bold text-slate-950">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* Table list box */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400 self-center mr-1" />
              {tabs.map((tab) => {
                const count =
                  tab.key === "all"
                    ? foundReports.length
                    : foundReports.filter((item) => item.status === tab.key)
                        .length;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full px-4 py-1.5 font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-650 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Showing {filteredReports.length} of {foundReports.length} found reports
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="pb-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Item Details</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Post ID</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Category & Location</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Finder Details</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Date & Time</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Status</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      No found reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const imageUrl = getImageUrl(report.image_path);
                    const isUpdating = updatingId === report.report_id;

                    return (
                      <tr
                        key={report.report_id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3.5 max-w-sm">
                            {imageUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage({ src: imageUrl, title: report.title })}
                                className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-xs transition hover:ring-2 hover:ring-blue-500"
                              >
                                <img
                                  src={imageUrl}
                                  alt={report.title}
                                  className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="h-4 w-4 text-white drop-shadow-md" />
                                </div>
                              </button>
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-400 font-semibold">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-sm truncate">
                                {report.title}
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-400">
                                {report.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 pr-4 font-semibold text-slate-700">
                          #FP-{report.report_id}
                        </td>

                        <td className="py-4 pr-4 text-slate-700">
                          <p className="font-semibold text-slate-800">{report.category}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {report.location} • {report.district}
                          </p>
                        </td>

                        <td className="py-4 pr-4 text-slate-700">
                          <p className="font-semibold text-slate-800">{report.user_name}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {report.user_email}
                          </p>
                        </td>

                        <td className="py-4 pr-4 text-slate-700">
                          <p className="font-semibold text-slate-800">{report.report_date}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {report.report_time || "Not specified"}
                          </p>
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              statusStyles[report.status] ||
                              "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {getStatusLabel(report.status)}
                          </span>
                        </td>

                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                            <button
                              onClick={() =>
                                updateReportStatus(report, "active")
                              }
                              disabled={
                                isUpdating ||
                                report.status === "active" ||
                                report.status === "matched"
                              }
                              className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-600 hover:bg-emerald-100 transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateReportStatus(report, "rejected")
                              }
                              disabled={
                                isUpdating ||
                                report.status === "rejected" ||
                                report.status === "matched"
                              }
                              className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-600 hover:bg-rose-100 transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Reject
                            </button>

                            <button
                              onClick={() =>
                                updateReportStatus(report, "pending")
                              }
                              disabled={
                                isUpdating ||
                                report.status === "pending" ||
                                report.status === "matched"
                              }
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Pending
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-5">
            <p>
              Auto-refreshes every 15 seconds. Stats update immediately after approval or rejection.
            </p>
          </div>
        </section>

        <ImagePreviewModal
          src={previewImage?.src}
          title={previewImage?.title}
          onClose={() => setPreviewImage(null)}
        />
      </div>
    </AdminLayout>
  );
}

export default ManageFoundReports;