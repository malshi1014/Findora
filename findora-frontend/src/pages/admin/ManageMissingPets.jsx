import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";

const statusClasses = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

function ManageMissingPets() {
  const [petReports, setPetReports] = useState([]);
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

  const fetchMissingPets = async (silent = false) => {
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
      console.log("Raw missing pets response:", text);

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
        const onlyMissingPets = (data.reports || []).filter(
          (item) => item.report_type === "missing_pet"
        );

        setPetReports(onlyMissingPets);
      } else {
        setError(data.message || "Failed to load missing pet reports.");
      }
    } catch (err) {
      console.error("Missing pets loading error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_all_reports.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissingPets();

    const intervalId = setInterval(() => {
      fetchMissingPets(true);
    }, 15000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateReportStatus = async (report, newStatus) => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      alert("Admin login required.");
      return;
    }

    if (report.status === newStatus) {
      alert(`This missing pet report is already ${newStatus}.`);
      return;
    }

    const confirmAction = window.confirm(
      `Are you sure you want to mark this missing pet report as ${newStatus}?`
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
            report_type: "missing_pet",
            status: newStatus,
          }),
        }
      );

      const text = await response.text();
      console.log("Raw missing pet status update response:", text);

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
        setPetReports((prevReports) =>
          prevReports.map((item) =>
            item.report_id === report.report_id
              ? { ...item, status: newStatus }
              : item
          )
        );

        alert("Missing pet report status updated successfully.");
      } else {
        alert(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to update report."
        );
      }
    } catch (err) {
      console.error("Missing pet update error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check update_report_status.php."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending Approval";
    if (status === "active") return "Verified";
    if (status === "rejected") return "Rejected";
    return status || "Unknown";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    return `${API_BASE_URL}/${imagePath}`;
  };

  const filteredReports = useMemo(() => {
    let result = [...petReports];

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
          item.nearest_town,
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
  }, [petReports, activeTab, searchText]);

  const stats = [
    {
      label: "Total Lost Pet Posts",
      value: petReports.length,
      detail: "All submitted missing pet posts",
    },
    {
      label: "Pending Approval",
      value: petReports.filter((item) => item.status === "pending").length,
      detail: "Waiting for admin review",
    },
    {
      label: "Verified Posts",
      value: petReports.filter((item) => item.status === "active").length,
      detail: "Displayed on Home page",
    },
    {
      label: "Rejected Posts",
      value: petReports.filter((item) => item.status === "rejected").length,
      detail: "Not displayed publicly",
    },
  ];

  const tabs = [
    { label: "All Posts", key: "all" },
    { label: "Pending Approval", key: "pending" },
    { label: "Verified", key: "active" },
    { label: "Rejected", key: "rejected" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-slate-700">
          Loading missing pet reports...
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => fetchMissingPets()}
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
                Lost Pets Posts Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Review and verify missing pet posts. These reports are not used
                for matching; verified posts are displayed on the Home page.
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
                  placeholder="Search ID, pet name, category, user..."
                  className="w-full rounded-full border border-slate-800 bg-slate-900/90 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => fetchMissingPets()}
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
                    ? petReports.length
                    : petReports.filter((item) => item.status === tab.key)
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
              Showing {filteredReports.length} of {petReports.length} pet posts
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Pet Details
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Post ID
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Category
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Reported By
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Last Seen
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Lost Date / Time
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No missing pet reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const imageUrl = getImageUrl(report.image_path);
                    const isUpdating = updatingId === report.report_id;

                    return (
                      <tr
                        key={report.report_id}
                        className="border-t border-slate-800"
                      >
                        <td className="py-5 pr-6">
                          <div className="flex items-center gap-4">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={report.title}
                                className="h-14 w-14 rounded-3xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-xs text-slate-500">
                                No
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-white">
                                {report.title}
                              </p>

                              <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                                {report.description || "No description"}
                              </p>

                              {report.unique_identifiers && (
                                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                  {report.unique_identifiers}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-5 pr-6 text-slate-300">
                          #PET-{report.report_id}
                        </td>

                        <td className="py-5 pr-6 text-slate-300">
                          {report.category || "Not specified"}
                        </td>

                        <td className="py-5 pr-6 text-slate-300">
                          <p>{report.user_name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {report.user_email}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {report.contact_no || "No contact"}
                          </p>
                        </td>

                        <td className="py-5 pr-6 text-slate-300">
                          <p>{report.location}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {report.nearest_town || "No nearest town"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {report.district || "No district"}
                          </p>
                        </td>

                        <td className="py-5 pr-6 text-slate-300">
                          <p>{report.report_date}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {report.report_time || "Not specified"}
                          </p>
                        </td>

                        <td className="py-5 pr-6">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              statusClasses[report.status] ||
                              "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {getStatusLabel(report.status)}
                          </span>
                        </td>

                        <td className="py-5 text-slate-300">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <button
                              onClick={() =>
                                updateReportStatus(report, "active")
                              }
                              disabled={
                                isUpdating || report.status === "active"
                              }
                              className="rounded-full bg-emerald-600 px-3 py-2 text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Verify
                            </button>

                            <button
                              onClick={() =>
                                updateReportStatus(report, "rejected")
                              }
                              disabled={
                                isUpdating || report.status === "rejected"
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
                                isUpdating || report.status === "pending"
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
              verification or rejection.
            </p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageMissingPets;