import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      type: "match",
      title: "Possible match found",
      message: "A few minutes ago, we found a match for your Vivid Neon report.",
      timestamp: "2d ago",
      action: "View Details",
      avatar: "D",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 2,
      type: "claim",
      title: "New claim request",
      message: "Someone has submitted a claim for your The Backpack found item.",
      timestamp: "5h ago",
      action: "Review Request",
      avatar: "C",
      color: "from-blue-400 to-indigo-500"
    },
    {
      id: 3,
      type: "comment",
      title: "Sarah Chen",
      message: "commented on your lost pet post.",
      timestamp: "6h ago",
      action: "View Post",
      avatar: "S",
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 4,
      type: "verified",
      title: "Report Verified",
      message: "Your Archius Pro report has been verified by the system and is now public.",
      timestamp: "Yesterday",
      action: "View Report",
      avatar: "V",
      color: "from-indigo-400 to-blue-500"
    }
  ]);

  const stats = [
    { label: "Unread Alerts", value: "3" },
    { label: "Pending Claims", value: "1" },
    { label: "New Comments", value: "4" }
  ];

  const handleAction = (notificationId, action) => {
    console.log(`Notification ${notificationId} action: ${action}`);
    alert(`Action: ${action} (stub)`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #7ec0fc 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-slate-950">Notifications</h1>
              <p className="mt-2 text-sm leading-7 text-slate-600">Stay informed about matches, claims, and activity on your reports.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 transition hover:bg-white/40">
                    <div className="flex gap-4">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${notification.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                        {notification.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                          </div>
                          <p className="text-xs font-medium text-slate-400 shrink-0">{notification.timestamp}</p>
                        </div>
                        <button onClick={() => handleAction(notification.id, notification.action)}
                          className="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                          {notification.action} &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{stat.value}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
