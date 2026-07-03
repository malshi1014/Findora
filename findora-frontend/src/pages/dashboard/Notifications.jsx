import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
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

  const fetchNotifications = async () => {
    const user = getCurrentUser();

    if (!user) {
      setError("Please login to view notifications.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/notifications/get_notifications.php?user_id=${user.user_id}`
      );

      const text = await response.text();
      console.log("Raw notifications response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Notifications:", data);

      if (data.status === "success") {
        setNotifications(data.notifications || []);
      } else {
        setError(data.message || "Failed to load notifications.");
      }
    } catch (err) {
      console.error("Notification error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_notifications.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    const user = getCurrentUser();

    if (!user) {
      alert("Please login again.");
      return;
    }

    setMarkingId(notificationId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/mark_notification_read.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notification_id: notificationId,
            user_id: user.user_id,
          }),
        }
      );

      const text = await response.text();
      console.log("Raw mark read response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Mark read response:", data);

      if (data.status === "success") {
        setNotifications((prevNotifications) =>
          prevNotifications.map((item) =>
            item.notification_id === notificationId
              ? { ...item, is_read: 1 }
              : item
          )
        );
      } else {
        alert(data.message || "Failed to update notification.");
      }
    } catch (err) {
      console.error("Mark read error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check mark_notification_read.php."
      );
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (item) => Number(item.is_read) === 0
  ).length;

  const matchCount = notifications.filter(
    (item) => item.type === "match_verified"
  ).length;

  const rejectedCount = notifications.filter(
    (item) => item.type === "match_rejected"
  ).length;

  const stats = [
    { label: "Unread Alerts", value: unreadCount, icon: "🔔" },
    { label: "Verified Matches", value: matchCount, icon: "✅" },
    { label: "Rejected Matches", value: rejectedCount, icon: "❌" },
  ];

  const getNotificationStyle = (type) => {
    if (type === "match_verified") {
      return {
        icon: "✓",
        title: "Match Verified",
        color: "bg-green-100",
        textColor: "text-green-600",
      };
    }

    if (type === "match_rejected") {
      return {
        icon: "!",
        title: "Match Rejected",
        color: "bg-red-100",
        textColor: "text-red-600",
      };
    }

    return {
      icon: "🔔",
      title: "Notification",
      color: "bg-blue-100",
      textColor: "text-blue-600",
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="p-6 text-slate-700">Loading notifications...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => {
              setLoading(true);
              fetchNotifications();
            }}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="mb-8 text-3xl font-bold text-slate-900">
            Notifications
          </h1>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="rounded-4xl bg-white p-8 text-center text-slate-500 shadow-lg ring-1 ring-slate-200">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => {
                const style = getNotificationStyle(notification.type);
                const isRead = Number(notification.is_read) === 1;

                return (
                  <div
                    key={notification.notification_id}
                    className={`rounded-4xl p-6 shadow-lg ring-1 transition-shadow hover:shadow-xl ${
                      isRead
                        ? "bg-white ring-slate-200"
                        : "bg-blue-50 ring-blue-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${style.color} ${style.textColor}`}
                      >
                        {style.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {style.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-600">
                              {notification.message}
                            </p>

                            {notification.match_id && (
                              <p className="mt-2 text-xs text-slate-400">
                                Match ID: #{notification.match_id}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-xs font-medium text-slate-500">
                              {notification.created_at || "No date"}
                            </p>

                            {isRead ? (
                              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                Read
                              </span>
                            ) : (
                              <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                Unread
                              </span>
                            )}
                          </div>
                        </div>

                        {!isRead && (
                          <button
                            onClick={() =>
                              markAsRead(notification.notification_id)
                            }
                            disabled={markingId === notification.notification_id}
                            className="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
                          >
                            {markingId === notification.notification_id
                              ? "Updating..."
                              : "Mark as Read →"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-4xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg ring-1 ring-blue-200"
            >
              <div className="mb-2 text-3xl">{stat.icon}</div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;