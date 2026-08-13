import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import AdminLayout from "../../layouts/AdminLayout";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

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

  const fetchReports = async (status = activeStatus) => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      setError("Admin login required.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/get_all_reports.php?admin_id=${user.user_id}&status=${status}`
      );

      const text = await response.text();
      console.log("Raw admin reports response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Admin reports:", data);

      if (data.status === "success") {
        setReports(data.reports || []);
      } else {
        setError(data.message || "Failed to load reports.");
      }
    } catch (err) {
      console.error("Admin reports error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_all_reports.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports("all");
  }, []);

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    setLoading(true);
    fetchReports(status);
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
  };

  const updateReportStatus = async (report, newStatus) => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      alert("Admin login required.");
      return;
    }

    const confirmAction = window.confirm(
      `Are you sure you want to mark this ${getReportTypeLabel(
        report.report_type
      )} as ${newStatus}?`
    );

    if (!confirmAction) {
      return;
    }

    const updateKey = `${report.report_type}-${report.report_id}`;
    setUpdatingId(updateKey);

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
            report_type: report.report_type,
            status: newStatus,
          }),
        }
      );

      const text = await response.text();
      console.log("Raw update status response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Update status:", data);

      if (data.status === "success") {
        alert("Report status updated successfully.");
        fetchReports(activeStatus);
      } else {
        alert(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to update report."
        );
      }
    } catch (err) {
      console.error("Update report status error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check update_report_status.php."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    return `${API_BASE_URL}/${imagePath}`;
  };

  const getStatusStyle = (status) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "matched") return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
  };

  const getTypeStyle = (type) => {
    if (type === "lost") return "bg-red-50 text-red-700";
    if (type === "found") return "bg-green-50 text-green-700";
    if (type === "suspicious") return "bg-purple-50 text-purple-700";
    if (type === "missing_pet") return "bg-pink-50 text-pink-700";
    if (type === "missing_person") return "bg-blue-50 text-blue-700";
    return "bg-slate-50 text-slate-700";
  };

  const getReportTypeLabel = (type) => {
    if (type === "lost") return "Lost Item Report";
    if (type === "found") return "Found Item Report";
    if (type === "suspicious") return "Suspicious Item Report";
    if (type === "missing_pet") return "Missing Pet Post";
    if (type === "missing_person") return "Missing Person Post";
    return "Report";
  };

  const typeFilters = [
    { key: "all", label: "All Reports", count: reports.length },
    {
      key: "lost",
      label: "Lost Items",
      count: reports.filter((item) => item.report_type === "lost").length,
    },
    {
      key: "found",
      label: "Found Items",
      count: reports.filter((item) => item.report_type === "found").length,
    },
    {
      key: "suspicious",
      label: "Suspicious Items",
      count: reports.filter((item) => item.report_type === "suspicious").length,
    },
    {
      key: "missing_pet",
      label: "Missing Pets",
      count: reports.filter((item) => item.report_type === "missing_pet")
        .length,
    },
    {
      key: "missing_person",
      label: "Missing People",
      count: reports.filter((item) => item.report_type === "missing_person")
        .length,
    },
  ];

  const filteredReports =
    activeType === "all"
      ? reports
      : reports.filter((item) => item.report_type === activeType);

  const pendingCount = filteredReports.filter(
    (item) => item.status === "pending"
  ).length;

  const activeCount = filteredReports.filter(
    (item) => item.status === "active"
  ).length;

  const rejectedCount = filteredReports.filter(
    (item) => item.status === "rejected"
  ).length;

  const matchedCount = filteredReports.filter(
    (item) => item.status === "matched"
  ).length;

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
            onClick={() => {
              setLoading(true);
              fetchReports(activeStatus);
            }}
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
        <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 md:p-8 shadow-sm backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Admin Panel
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Report Approval Center
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review and approve lost item, found item, suspicious item, missing pet and missing person reports.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
              <p className="text-sm font-semibold text-orange-700">Pending</p>
              <p className="mt-2 text-2xl font-bold text-orange-700">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-sm font-semibold text-emerald-700">Active</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
              <p className="text-sm font-semibold text-red-700">Rejected</p>
              <p className="mt-2 text-2xl font-bold text-red-700">
                {rejectedCount}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-sm font-semibold text-blue-700">Matched</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">
                {matchedCount}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter by Report Type
            </p>

            <div className="flex flex-wrap gap-2">
              {typeFilters.map((type) => (
                <button
                  key={type.key}
                  onClick={() => handleTypeFilter(type.key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    activeType === type.key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter by Status
            </p>

            <div className="flex flex-wrap gap-2">
              {["all", "pending", "active", "rejected", "matched"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                      activeStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-8 text-center text-slate-500 shadow-sm backdrop-blur-md">
            No {activeType === "all" ? "reports" : getReportTypeLabel(activeType)} found.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredReports.map((report) => {
              const imageUrl = getImageUrl(report.image_path);
              const updateKey = `${report.report_type}-${report.report_id}`;
              const isUpdating = updatingId === updateKey;

              return (
                <div
                  key={updateKey}
                  className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={report.title}
                          className="h-28 w-28 shrink-0 rounded-xl object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-400">
                          No Image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTypeStyle(
                                report.report_type
                              )}`}
                            >
                              {getReportTypeLabel(report.report_type)}
                            </span>

                            <h2 className="mt-2 text-base font-bold text-slate-950 line-clamp-1">
                              {report.title}
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {report.category || "No category"} •{" "}
                              {report.district || "No district"}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </div>

                        <p className="mt-2.5 line-clamp-2 text-xs text-slate-500">
                          {report.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2.5 text-xs text-slate-500 sm:grid-cols-2 border-t border-slate-100 pt-4">
                      <p>
                        <span className="font-semibold text-slate-800">User:</span>{" "}
                        {report.user_name || "Not available"}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">Email:</span>{" "}
                        {report.user_email || "Not available"}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">Contact:</span>{" "}
                        {report.contact_no || "Not specified"}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">Date:</span>{" "}
                        {report.report_date || "Not specified"}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">Time:</span>{" "}
                        {report.report_time || "Not specified"}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">Location:</span>{" "}
                        {report.location || "Not specified"}
                      </p>

                      {report.nearest_town && (
                        <p>
                          <span className="font-semibold text-slate-800">Nearest Town:</span>{" "}
                          {report.nearest_town}
                        </p>
                      )}

                      {report.age && (
                        <p>
                          <span className="font-semibold text-slate-800">Age:</span>{" "}
                          {report.age}
                        </p>
                      )}

                      {report.gender && (
                        <p>
                          <span className="font-semibold text-slate-800">Gender:</span>{" "}
                          {report.gender}
                        </p>
                      )}
                    </div>

                    {report.unique_identifiers && (
                      <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">Identifiers:</span>{" "}
                        {report.unique_identifiers}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => updateReportStatus(report, "active")}
                      disabled={isUpdating || report.status === "matched"}
                      className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateReportStatus(report, "rejected")}
                      disabled={isUpdating || report.status === "matched"}
                      className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => updateReportStatus(report, "pending")}
                      disabled={isUpdating || report.status === "matched"}
                      className="rounded-full bg-slate-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Pending
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminReports;