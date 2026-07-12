import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShopLayout from "../../layouts/ShopLayout";
import API_BASE_URL from "../../config/api";

function ShopOwnerDashboard() {
  const [reports, setReports] = useState({
    suspicious_reports: [],
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const user = getCurrentUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setError("Please login to view dashboard.");
        setLoading(false);
        return;
      }

      if (currentUser.role !== "shop_owner" && currentUser.role !== "admin") {
        setError("Only shop owners can view this dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("API BASE URL:", API_BASE_URL);
        console.log("Logged shop owner:", currentUser);

        const reportsResponse = await fetch(
          `${API_BASE_URL}/reports/get_my_reports.php?user_id=${currentUser.user_id}`
        );

        const reportsText = await reportsResponse.text();
        console.log("Raw shop owner reports response:", reportsText);

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
            suspicious_reports: reportsData.suspicious_reports || [],
          });
        } else {
          throw new Error(reportsData.message || "Failed to load reports.");
        }

        try {
          const notificationResponse = await fetch(
            `${API_BASE_URL}/notifications/get_notifications.php?user_id=${currentUser.user_id}`
          );

          const notificationText = await notificationResponse.text();
          console.log("Raw shop notifications response:", notificationText);

          if (notificationText) {
            const notificationData = JSON.parse(notificationText);

            if (notificationData.status === "success") {
              setNotifications(notificationData.notifications || []);
            }
          }
        } catch (notificationError) {
          console.warn("Notifications failed, but dashboard will still load.");
          setNotifications([]);
        }
      } catch (err) {
        console.error("Shop dashboard error:", err);
        setError(err.message || "Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const suspiciousReports = reports.suspicious_reports.map((item) => ({
    ...item,
    type: "Suspicious",
    title: item.title || item.item_name || "Suspicious Item",
    date: item.report_date || item.found_date || item.created_at,
    time: item.report_time || item.found_time || "",
    location: item.location || item.last_seen_location || "Not specified",
    contact: item.contact_no || item.contact || "Not specified",
  }));

  const recentReports = suspiciousReports.slice(0, 4);
  const recentNotifications = notifications.slice(0, 3);

  const unreadCount = notifications.filter((item) => item.is_read == 0).length;
  const pendingReports = suspiciousReports.filter(
    (item) => item.status === "pending"
  ).length;
  const activeReports = suspiciousReports.filter(
    (item) => item.status === "active"
  ).length;
  const rejectedReports = suspiciousReports.filter(
    (item) => item.status === "rejected"
  ).length;

  const getImageUrl = (report) => {
    if (report.images && report.images.length > 0) {
      return `${API_BASE_URL}/${report.images[0].image_path}`;
    }

    if (report.image_path) {
      return `${API_BASE_URL}/${report.image_path}`;
    }

    return null;
  };

  const getStatusStyle = (status) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <ShopLayout>
        <p className="p-6 text-slate-700">Loading shop owner dashboard...</p>
      </ShopLayout>
    );
  }

  if (error) {
    return (
      <ShopLayout>
        <div className="p-6">
          <p className="text-red-600">{error}</p>

          <Link
            to="/shop-owner/report-suspicious"
            className="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Report Suspicious Item
          </Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-100 to-white py-10">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex-1 rounded-2xl border border-white/40 bg-white/30 p-8 shadow-lg backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Shop Owner Dashboard
              </p>

              <h1 className="mt-4 text-3xl font-bold text-slate-950">
                Welcome back, {user?.first_name || "Shop Owner"}!
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-700">
                Submit suspicious item reports and track admin approval status.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-white/50 bg-white/60 p-5 shadow-xl backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Total Reports
                  </p>
                  <p className="mt-3 text-3xl font-bold text-blue-600">
                    {suspiciousReports.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/50 bg-white/60 p-5 shadow-xl backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Pending
                  </p>
                  <p className="mt-3 text-3xl font-bold text-orange-500">
                    {pendingReports}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/50 bg-white/60 p-5 shadow-xl backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Active
                  </p>
                  <p className="mt-3 text-3xl font-bold text-green-600">
                    {activeReports}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/50 bg-white/60 p-5 shadow-xl backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Rejected
                  </p>
                  <p className="mt-3 text-3xl font-bold text-red-600">
                    {rejectedReports}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/50 bg-white/40 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Suspicious Item Status
                  </p>
                  <p className="text-sm text-slate-700">
                    You have {pendingReports} pending report(s), {activeReports} approved report(s), and {unreadCount} unread alert(s).
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
                      <div className="rounded-3xl border border-white/50 bg-white/40 p-5 shadow-xl backdrop-blur-xl">
                        <p className="text-sm text-slate-600">
                          No recent notifications yet.
                        </p>
                      </div>
                    ) : (
                      recentNotifications.map((item) => (
                        <div
                          key={item.notification_id}
                          className="rounded-3xl border border-white/50 bg-white/40 p-5 shadow-xl backdrop-blur-xl"
                        >
                          <p className="text-xs text-blue-600">
                            {item.created_at}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            Notification
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
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
                      My Suspicious Reports
                    </h4>

                    <Link
                      to="/shop-owner/report-suspicious"
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Add New
                    </Link>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {recentReports.length === 0 ? (
                      <div className="rounded-3xl border border-white/50 bg-white/40 p-5 text-center shadow-xl backdrop-blur-xl sm:col-span-2">
                        <p className="text-sm text-slate-600">
                          You have not submitted suspicious item reports yet.
                        </p>
                      </div>
                    ) : (
                      recentReports.map((report) => {
                        const imageUrl = getImageUrl(report);

                        return (
                          <div
                            key={`suspicious-${report.report_id || report.suspicious_id}`}
                            className="rounded-3xl border border-white/50 bg-white/40 p-4 shadow-xl backdrop-blur-xl"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={report.title}
                                className="h-24 w-full rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                No Image
                              </div>
                            )}

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <p className="line-clamp-1 text-sm font-semibold text-slate-950">
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
                              Suspicious Item Report
                            </p>

                            <p className="text-xs text-slate-500">
                              Reported: {report.date || "Not specified"}
                            </p>
                          </div>
                        );
                      })
                    )}

                    <Link
                      to="/shop-owner/report-suspicious"
                      className="flex min-h-[120px] items-center justify-center rounded-3xl border border-dashed border-white/50 bg-white/40 p-4 text-center text-sm font-bold text-slate-700 shadow-xl transition hover:bg-white/60"
                    >
                      Report Suspicious Item
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="w-full max-w-sm space-y-4">
              <div className="rounded-2xl border border-white/40 bg-white/30 p-6 shadow-lg backdrop-blur-xl">
                <h4 className="text-sm font-semibold text-slate-900">
                  Shop Owner Tip
                </h4>

                <p className="mt-3 text-sm text-slate-700">
                  Report suspicious devices or items with accurate location and contact details. Admins will review them before taking action.
                </p>

                <Link
                  to="/shop-owner/report-suspicious"
                  className="mt-4 inline-flex rounded-full bg-blue-600/90 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
                >
                  Submit Report
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

export default ShopOwnerDashboard;