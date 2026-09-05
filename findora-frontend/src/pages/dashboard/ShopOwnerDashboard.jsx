import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShopLayout from "../../layouts/ShopLayout";
import API_BASE_URL from "../../config/api";
import { ShieldAlert, AlertTriangle, Bell, ArrowRight, ShieldCheck, Plus, Search, Clock, XCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

function ShopOwnerDashboard() {
  const [reports, setReports] = useState({
    suspicious_reports: [],
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("findora_user");
    if (!storedUser) return null;
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

        const reportsResponse = await fetch(
          `${API_BASE_URL}/reports/get_my_reports.php?user_id=${currentUser.user_id}`
        );

        const reportsText = await reportsResponse.text();

        if (!reportsText) throw new Error("Reports API returned empty response.");

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

          if (notificationText) {
            const notificationData = JSON.parse(notificationText);
            if (notificationData.status === "success") {
              setNotifications(notificationData.notifications || []);
            }
          }
        } catch (notificationError) {
          // Silently fail notifications
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
  const pendingReports = suspiciousReports.filter((item) => item.status === "pending").length;
  const activeReports = suspiciousReports.filter((item) => item.status === "active").length;
  const rejectedReports = suspiciousReports.filter((item) => item.status === "rejected").length;

  const getImageUrl = (report) => {
    if (report.images && report.images.length > 0) return `${API_BASE_URL}/${report.images[0].image_path}`;
    if (report.image_path) return `${API_BASE_URL}/${report.image_path}`;
    return null;
  };

  const getStatusIcon = (status) => {
    if (status === "active") return <ShieldCheck className="w-3 h-3 mr-1" />;
    if (status === "pending") return <Clock className="w-3 h-3 mr-1" />;
    if (status === "rejected") return <XCircle className="w-3 h-3 mr-1" />;
    return <FileText className="w-3 h-3 mr-1" />;
  };

  const getStatusStyle = (status) => {
    if (status === "active") return "bg-green-50 text-green-700 border-green-200";
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <ShopLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </ShopLayout>
    );
  }

  if (error) {
    return (
      <ShopLayout>
        <div className="p-8">
          <div className="rounded-xl bg-red-50 p-6 border border-red-100 text-red-600">
            <AlertTriangle className="mb-2 h-6 w-6" />
            <h3 className="font-semibold text-red-800">Error Loading Dashboard</h3>
            <p className="text-sm mt-1">{error}</p>
            <Link
              to="/shop-owner/report-suspicious"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              Report Suspicious Item Anyway
            </Link>
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.first_name || "Shop Owner"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your store's security and suspicious item reports.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/shop-owner/report-suspicious"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
            >
              <ShieldAlert className="w-4 h-4" />
              Report Suspicious Item
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-5 md:grid-cols-4">
          <motion.div whileHover={{ y: -2 }} className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Reports</p>
                <p className="text-2xl font-bold text-slate-900">{suspiciousReports.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{pendingReports}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active</p>
                <p className="text-2xl font-bold text-slate-900">{activeReports}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Rejected</p>
                <p className="text-2xl font-bold text-slate-900">{rejectedReports}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area - Recent Reports */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Suspicious Reports</h2>
              <Link to="/shop-owner/report-suspicious" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {recentReports.length === 0 ? (
                <div className="sm:col-span-2 rounded-xl bg-white border border-dashed border-slate-300 p-12 text-center">
                  <ShieldAlert className="mx-auto h-8 w-8 text-slate-400 mb-3" />
                  <h3 className="text-sm font-medium text-slate-900">No reports found</h3>
                  <p className="mt-1 text-sm text-slate-500">Your store's suspicious activity reports will appear here.</p>
                  <Link
                    to="/shop-owner/report-suspicious"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4" />
                    Report Issue
                  </Link>
                </div>
              ) : (
                recentReports.map((report) => {
                  const imageUrl = getImageUrl(report);
                  return (
                    <div
                      key={`suspicious-${report.report_id || report.suspicious_id}`}
                      className="group rounded-xl bg-white border border-slate-200 p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60">
                          {imageUrl ? (
                            <img src={imageUrl} alt={report.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <ShieldAlert className="h-6 w-6 opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{report.title}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{report.date || "Not specified"}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusStyle(report.status)}`}>
                              {getStatusIcon(report.status)}
                              <span className="capitalize">{report.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar Area - Notifications & Tips */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {unreadCount} New
                  </span>
                )}
              </div>
              
              <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {recentNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentNotifications.map((item) => (
                      <div key={item.notification_id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Notification</p>
                            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.message}</p>
                            <p className="mt-2 text-xs text-slate-400">{item.created_at}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tip Box */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 shadow-sm">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Shop Owner Tip</h4>
                  <p className="mt-1.5 text-sm text-blue-700 leading-relaxed">
                    Report suspicious devices or items with accurate location and contact details. Ensure you provide clear photos if available.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ShopLayout>
  );
}

export default ShopOwnerDashboard;