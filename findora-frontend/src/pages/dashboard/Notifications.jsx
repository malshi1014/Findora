import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      type: "match",
      icon: "✓",
      title: "Possible match found",
      message: "A few minutes ago, we found a match for your Vivid Neon report.",
      timestamp: "2d ago",
      action: "View Details",
      color: "bg-green-100",
      textColor: "text-green-600",
      badge: "bg-green-50"
    },
    {
      id: 2,
      type: "claim",
      icon: "📋",
      title: "New claim request",
      message: "Someone has submitted a claim for your The Backpack found item.",
      timestamp: "5h ago",
      action: "Review Request",
      color: "bg-blue-100",
      textColor: "text-blue-600",
      badge: "bg-blue-50"
    },
    {
      id: 3,
      type: "comment",
      icon: "💬",
      title: "Sarah Chen",
      message: "commented on your lost pet post.",
      timestamp: "6h ago",
      action: "View Post",
      color: "bg-purple-100",
      textColor: "text-purple-600",
      badge: "bg-purple-50",
      avatar: "S"
    },
    {
      id: 4,
      type: "verified",
      icon: "✓",
      title: "Report Verified",
      message: "Your Archius Pro report has been verified by the system and is now public.",
      timestamp: "Yesterday",
      action: "View Report",
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      badge: "bg-indigo-50"
    }
  ]);

  const stats = [
    { label: "Unread Alerts", value: "3", icon: "🔔" },
    { label: "Pending Claims", value: "1", icon: "⏳" },
    { label: "New Comments", value: "4", icon: "💬" }
  ];

  const handleAction = (notificationId, action) => {
    console.log(`Notification ${notificationId} action: ${action}`);
    alert(`Action: ${action} (stub)`);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Notifications List */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Notifications</h1>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-4xl bg-white p-6 shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Avatar/Icon */}
                  <div
                    className={`h-12 w-12 rounded-full ${notification.color} flex items-center justify-center text-lg font-bold shrink-0 ${notification.textColor}`}
                  >
                    {notification.avatar || notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-slate-500">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAction(notification.id, notification.action)}
                      className="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {notification.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="space-y-4 lg:sticky lg:top-24">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-4xl bg-linear-to-br from-blue-50 to-blue-100 p-6 shadow-lg ring-1 ring-blue-200"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;