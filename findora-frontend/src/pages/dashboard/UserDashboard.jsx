import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";

function UserDashboard() {
  const [reports, setReports] = useState({
    lost_reports: [],
    found_reports: [],
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("findora_user"));

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

useEffect(() => {
  const fetchDashboardData = async () => {
    const user = getCurrentUser();

    if (!user) {
      setError("Please login to view dashboard.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("API BASE URL:", API_BASE_URL);
      console.log("Logged user:", user);

      const reportsResponse = await fetch(
        `${API_BASE_URL}/reports/get_my_reports.php?user_id=${user.user_id}`
      );

      const reportsText = await reportsResponse.text();
      console.log("Raw reports response:", reportsText);

      if (!reportsText) {
        throw new Error("Reports API returned empty response.");
      }

      let reportsData;

      try {
        reportsData = JSON.parse(reportsText);
      } catch {
        throw new Error("Reports API did not return valid JSON.");
      }

      if (reportsData.status === "success") {
        setReports({
          lost_reports: reportsData.lost_reports || [],
          found_reports: reportsData.found_reports || [],
          suspicious_reports: reportsData.suspicious_reports || [],
        });
      } else {
        throw new Error(reportsData.message || "Failed to load reports.");
      }

      const notificationResponse = await fetch(
        `${API_BASE_URL}/notifications/get_notifications.php?user_id=${user.user_id}`
      );

      const notificationText = await notificationResponse.text();
      console.log("Raw notifications response:", notificationText);

      if (!notificationText) {
        throw new Error("Notifications API returned empty response.");
      }

      let notificationData;

      try {
        notificationData = JSON.parse(notificationText);
      } catch {
        throw new Error("Notifications API did not return valid JSON.");
      }

      if (notificationData.status === "success") {
        setNotifications(notificationData.notifications || []);
      } else {
        throw new Error(
          notificationData.message || "Failed to load notifications."
        );
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const allReports = [
    ...reports.lost_reports.map((item) => ({
      ...item,
      type: "Lost",
      date: item.lost_date,
      time: item.lost_time,
    })),
    ...reports.found_reports.map((item) => ({
      ...item,
      type: "Found",
      date: item.found_date,
      time: item.found_time,
    })),
  ];

  const recentReports = allReports.slice(0, 4);
  const recentNotifications = notifications.slice(0, 3);

  const unreadCount = notifications.filter((item) => item.is_read == 0).length;
  const pendingReports = allReports.filter((item) => item.status === "pending").length;
  const matchedReports = allReports.filter((item) => item.status === "matched").length;

  const getImageUrl = (report) => {
    if (report.images && report.images.length > 0) {
      return `${API_BASE_URL}/${report.images[0].image_path}`;
    }

    return null;
  };

  const getStatusStyle = (status) => {
    if (status === "matched") {
      return "bg-green-100 text-green-700";
    }

    if (status === "pending") {
      return "bg-orange-100 text-orange-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <RoleBasedLayout>
        <p className="p-6 text-slate-700">Loading dashboard...</p>
      </RoleBasedLayout>
    );
  }

  if (error) {
    return (
      <RoleBasedLayout>
        <p className="p-6 text-red-600">{error}</p>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-white py-10">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex-1 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Dashboard Overview
              </p>

              <h1 className="mt-4 text-3xl font-bold text-slate-950">
                Welcome back, {user?.first_name || "User"}!
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-700">
                Track your lost and found reports, monitor match updates and view recent platform activity.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 p-5 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Total Reports
                  </p>
                  <p className="mt-3 text-3xl font-bold text-blue-600">
                    {allReports.length}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 p-5 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Pending Reports
                  </p>
                  <p className="mt-3 text-3xl font-bold text-orange-500">
                    {pendingReports}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 p-5 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Unread Alerts
                  </p>
                  <p className="mt-3 text-3xl font-bold text-purple-600">
                    {unreadCount}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 p-4 shadow-xl">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Findora Recovery Status
                  </p>
                  <p className="text-sm text-slate-700">
                    You have {matchedReports} matched report(s) and {pendingReports} pending report(s).
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Recent Activity
                  </h4>

                  <div className="mt-2 space-y-4">
                    {recentNotifications.length === 0 ? (
                      <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 p-5 shadow-xl">
                        <p className="text-sm text-slate-600">
                          No recent notifications yet.
                        </p>
                      </div>
                    ) : (
                      recentNotifications.map((item) => (
                        <div
                          key={item.notification_id}
                          className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 p-5 shadow-xl"
                        >
                          <p className="text-xs text-blue-600">
                            {item.created_at}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {item.type === "match_verified"
                              ? "Match Verified"
                              : item.type === "match_rejected"
                              ? "Match Rejected"
                              : "Notification"}
                          </p>
                          <p className="text-sm text-slate-700 mt-1">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">
                      My Recent Reports
                    </h4>

                    <Link
                      to="/user-dashboard/my-reports"
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                    {recentReports.length === 0 ? (
                      <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 p-5 shadow-xl text-center sm:col-span-2">
                        <p className="text-sm text-slate-600">
                          You have not submitted any reports yet.
                        </p>
                      </div>
                    ) : (
                      recentReports.map((report) => {
                        const imageUrl = getImageUrl(report);

                        return (
                          <div
                            key={`${report.type}-${report.report_id}`}
                            className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 p-4 shadow-xl"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={report.title}
                                className="h-24 w-full rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="h-24 w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                No Image
                              </div>
                            )}

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-950 line-clamp-1">
                                {report.title}
                              </p>

                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusStyle(
                                  report.status
                                )}`}
                              >
                                {report.status}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-600">
                              {report.type} Report
                            </p>

                            <p className="text-xs text-slate-500">
                              Reported: {report.date}
                            </p>
                          </div>
                        );
                      })
                    )}

                    <Link
                      to="/user-dashboard/report-lost"
                      className="rounded-3xl bg-white/40 backdrop-blur-xl border border-dashed border-white/50 p-4 shadow-xl flex items-center justify-center text-lg font-bold text-slate-700 transition hover:bg-white/60"
                    >
                      +
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="w-full max-w-sm space-y-4">
              <div className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg p-6">
                <h4 className="text-sm font-semibold text-slate-900">
                  Profile Strength
                </h4>
                <p className="mt-2 text-2xl font-bold text-blue-600">85%</p>
                <p className="mt-3 text-sm text-slate-700">
                  Complete your identity verification to increase your trust score among the Findora community.
                </p>
                <button className="mt-4 bg-blue-600/90 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-700">
                  Verify Identity Now
                </button>
              </div>

              <div className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg p-6">
                <h4 className="text-sm font-semibold text-slate-900">
                  Quick Actions
                </h4>

                <div className="mt-4 space-y-3">
                  <Link
                    to="/user-dashboard/report-lost"
                    className="block rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Report Lost Item
                  </Link>

                  <Link
                    to="/user-dashboard/report-found"
                    className="block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-blue-700 shadow hover:bg-blue-50"
                  >
                    Report Found Item
                  </Link>

                  <Link
                    to="/user-dashboard/notifications"
                    className="block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow hover:bg-slate-50"
                  >
                    View Notifications
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}

export default UserDashboard;