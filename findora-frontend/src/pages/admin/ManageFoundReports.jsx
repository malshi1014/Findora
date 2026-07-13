import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  matched: "bg-sky-100 text-sky-700",
};

function ManageFoundReports() {
  const [foundReports, setFoundReports] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
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
      alert("Matched/returned reports cannot be changed.");
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
    if (status === "matched") return "Returned";
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
      label: "Pending Verification",
      value: foundReports.filter((item) => item.status === "pending").length,
      detail: "Waiting for admin review",
    },
    {
      label: "Approved Posts",
      value: foundReports.filter((item) => item.status === "active").length,
      detail: "Visible for matching process",
    },
    {
      label: "Successfully Returned",
      value: foundReports.filter((item) => item.status === "matched").length,
      detail: "Successfully matched reports",
    },
  ];

  const tabs = [
    { label: "All Posts", key: "all" },
    { label: "Pending", key: "pending" },
    { label: "Approved", key: "active" },
    { label: "Rejected", key: "rejected" },
    { label: "Returned", key: "matched" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-slate-700">Loading found reports...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => fetchFoundReports()}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                Findora Admin
              </p>

              <h1 className="mt-4 text-4xl font-semibold">
                Found Posts Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Review, approve, reject and monitor all found item reports
                submitted by users.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-sm">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  🔍
                </span>

                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search ID, category, user, location..."
                  className="w-full rounded-full border border-slate-800 bg-slate-900/90 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => fetchFoundReports()}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] bg-blue-950/95 p-6 shadow-xl shadow-slate-900/20"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>

              <p className="mt-4 text-3xl font-semibold text-white">
                {stat.value}
              </p>

              <p className="mt-3 text-sm text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
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
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      activeTab === tab.key
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400">
              Showing {filteredReports.length} of {foundReports.length} found
              reports
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-separate border-spacing-y-3 text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Image
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Post ID
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Title
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Category / Location
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Reported By
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Date / Time
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-sm text-slate-400"
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
                        className="rounded-[1.5rem] bg-slate-900/80 shadow-sm shadow-slate-950/20"
                      >
                        <td className="py-5 pr-6 align-middle">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={report.title}
                              className="h-16 w-16 rounded-3xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-xs text-slate-300">
                              No Img
                            </div>
                          )}
                        </td>

                        <td className="py-5 pr-6 align-middle font-semibold text-white">
                          #FP-{report.report_id}
                        </td>

                        <td className="py-5 pr-6 align-middle">
                          <p className="font-semibold text-white">
                            {report.title}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                            {report.description}
                          </p>
                        </td>

                        <td className="py-5 pr-6 align-middle text-slate-300">
                          <p>{report.category}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {report.location}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {report.district}
                          </p>
                        </td>

                        <td className="py-5 pr-6 align-middle text-slate-300">
                          <p>{report.user_name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {report.user_email}
                          </p>
                        </td>

                        <td className="py-5 pr-6 align-middle text-slate-300">
                          <p>{report.report_date}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {report.report_time || "Not specified"}
                          </p>
                        </td>

                        <td className="py-5 pr-6 align-middle">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[report.status] ||
                              "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {getStatusLabel(report.status)}
                          </span>
                        </td>

                        <td className="py-5 align-middle">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <button
                              onClick={() =>
                                updateReportStatus(report, "active")
                              }
                              disabled={
                                isUpdating ||
                                report.status === "active" ||
                                report.status === "matched"
                              }
                              className="rounded-full bg-emerald-600 px-3 py-2 text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                              className="rounded-full bg-rose-600 px-3 py-2 text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                              className="rounded-full bg-slate-800 px-3 py-2 text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
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

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <p>
              Auto-refreshes every 15 seconds. Stats update immediately after
              approval or rejection.
            </p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageFoundReports;