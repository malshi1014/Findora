import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
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

  const updateReportStatus = async (report, newStatus) => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      alert("Admin login required.");
      return;
    }

    const confirmAction = window.confirm(
      `Are you sure you want to mark this report as ${newStatus}?`
    );

    if (!confirmAction) {
      return;
    }

    setUpdatingId(`${report.report_type}-${report.report_id}`);

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

  const pendingCount = reports.filter((item) => item.status === "pending")
    .length;
  const activeCount = reports.filter((item) => item.status === "active").length;
  const rejectedCount = reports.filter((item) => item.status === "rejected")
    .length;
  const matchedCount = reports.filter((item) => item.status === "matched")
    .length;

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-700">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>

        <button
          onClick={() => {
            setLoading(true);
            fetchReports(activeStatus);
          }}
          className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="rounded-4xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
          Admin Panel
        </p>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">
          Report Management
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Review lost and found reports submitted by users. Approve reports to
          make them active for matching and reject invalid reports.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-3xl bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-700">Pending</p>
            <p className="mt-2 text-2xl font-bold text-orange-700">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-3xl bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-700">Active</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {activeCount}
            </p>
          </div>

          <div className="rounded-3xl bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-red-700">
              {rejectedCount}
            </p>
          </div>

          <div className="rounded-3xl bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-700">Matched</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">
              {matchedCount}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {["all", "pending", "active", "rejected", "matched"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${
                activeStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-4xl bg-white p-8 text-center text-slate-500 shadow-xl ring-1 ring-slate-200">
          No reports found.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {reports.map((report) => {
            const imageUrl = getImageUrl(report.image_path);
            const updateKey = `${report.report_type}-${report.report_id}`;
            const isUpdating = updatingId === updateKey;

            return (
              <div
                key={updateKey}
                className="rounded-4xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
              >
                <div className="flex gap-5">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={report.title}
                      className="h-36 w-36 shrink-0 rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-3xl bg-slate-100 text-sm text-slate-400">
                      No Image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
                          {report.report_type} report
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-950">
                          {report.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {report.category} • {report.district}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-800">User:</span>{" "}
                    {report.user_name}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">Email:</span>{" "}
                    {report.user_email}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">
                      Contact:
                    </span>{" "}
                    {report.contact_no}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">Date:</span>{" "}
                    {report.report_date}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">Time:</span>{" "}
                    {report.report_time || "Not specified"}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">
                      Location:
                    </span>{" "}
                    {report.location}
                  </p>
                </div>

                {report.unique_identifiers && (
                  <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Identifiers:
                    </span>{" "}
                    {report.unique_identifiers}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => updateReportStatus(report, "active")}
                    disabled={isUpdating || report.status === "matched"}
                    className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateReportStatus(report, "rejected")}
                    disabled={isUpdating || report.status === "matched"}
                    className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateReportStatus(report, "pending")}
                    disabled={isUpdating || report.status === "matched"}
                    className="rounded-full bg-slate-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

export default AdminReports;