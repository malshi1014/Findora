import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const initialPosts = [
  { id: 1, type: "Lost", title: "Sony WH-1000XM4 Headphones", status: "Active", date: "Oct 24, 2023", matches: 2, views: 145, location: "Central Park Cafe" },
  { id: 2, type: "Found", title: "Black Leather Wallet", status: "Active", date: "Oct 20, 2023", matches: 1, views: 89, location: "Main Street Station" },
  { id: 3, type: "Missing Person", title: "Emily Watson", status: "Resolved", date: "Oct 15, 2023", matches: 0, views: 312, location: "Riverside Mall" },
  { id: 4, type: "Lost", title: "Silver Samsung Galaxy Watch", status: "Active", date: "Oct 12, 2023", matches: 1, views: 67, location: "Downtown Plaza" },
  { id: 5, type: "Found", title: "Brown Labrador Retriever", status: "Active", date: "Oct 10, 2023", matches: 1, views: 203, location: "Lakeview Park" },
  { id: 6, type: "Missing Pet", title: "Max - Golden Retriever", status: "Active", date: "Nov 2, 2023", matches: 0, views: 98, location: "Oakwood Heights" },
  { id: 7, type: "Suspicious Item", title: "Suspicious Laptop", status: "Active", date: "Nov 1, 2023", matches: 0, views: 156, location: "City Mall Food Court" },
];

const typeStyles = {
  Lost: "bg-rose-50 text-rose-600",
  Found: "bg-blue-50 text-blue-600",
  "Missing Person": "bg-amber-50 text-amber-600",
  "Missing Pet": "bg-teal-50 text-teal-600",
  "Suspicious Item": "bg-purple-50 text-purple-600",
};

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Resolved: "bg-slate-100 text-slate-600",
};

function MyPosts() {
  const [filter, setFilter] = useState("All");

  const filteredPosts = filter === "All" ? initialPosts : initialPosts.filter((p) => p.type === filter);
  const activeCount = initialPosts.filter((p) => p.status === "Active").length;
  const resolvedCount = initialPosts.filter((p) => p.status === "Resolved").length;
  const totalMatches = initialPosts.reduce((sum, p) => sum + p.matches, 0);

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">My Reports</span>
                  <h1 className="mt-4 text-3xl font-bold text-slate-950">My Posts</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Manage all your reports and listings in one place.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/40 backdrop-blur px-4 py-3 shadow-sm shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white text-lg font-bold">D</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                    <p className="text-sm text-slate-500">My Posts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-2xl font-bold text-slate-950">{activeCount}</p>
                <p className="text-xs text-slate-500 mt-1">Active Reports</p>
              </div>
              <div className="p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-2xl font-bold text-slate-950">{resolvedCount}</p>
                <p className="text-xs text-slate-500 mt-1">Resolved</p>
              </div>
              <div className="p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-2xl font-bold text-slate-950">{totalMatches}</p>
                <p className="text-xs text-slate-500 mt-1">Total Matches</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {["All", "Lost", "Found", "Missing Person", "Missing Pet", "Suspicious Item"].map((tab) => (
                <button key={tab} onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
                    filter === tab
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-white/40 backdrop-blur text-slate-600 border border-white/40 hover:bg-white/60"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 sm:p-7 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:bg-white/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <span className={`w-16 sm:w-20 text-center px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${typeStyles[post.type]}`}>
                        {post.type === "Missing Person" ? "Missing" : post.type === "Missing Pet" ? "Pet" : post.type === "Suspicious Item" ? "Suspicious" : post.type}
                      </span>
                      <div>
                        <p className="text-slate-900 text-base sm:text-xl font-bold leading-snug">{post.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{post.location} &middot; {post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-xs text-slate-400">{post.views} views</span>
                      {post.matches > 0 && (
                        <Link to="/matches" className="text-blue-600 text-xs sm:text-sm font-semibold hover:underline">
                          {post.matches} match{post.matches > 1 ? "es" : ""}
                        </Link>
                      )}
                      <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold ${statusStyles[post.status]}`}>
                        {post.status}
                      </span>
                      <button className="w-8 h-8 rounded-full bg-blue-600/5 flex items-center justify-center hover:bg-blue-600/15 transition">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M10 10.75C10.4142 10.75 10.75 10.4142 10.75 10C10.75 9.58579 10.4142 9.25 10 9.25C9.58579 9.25 9.25 9.58579 9.25 10C9.25 10.4142 9.58579 10.75 10 10.75Z" stroke="#64748B" strokeWidth="1.5"/>
                          <path d="M10 5.25C10.4142 5.25 10.75 4.91421 10.75 4.5C10.75 4.08579 10.4142 3.75 10 3.75C9.58579 3.75 9.25 4.08579 9.25 4.5C9.25 4.91421 9.58579 5.25 10 5.25Z" stroke="#64748B" strokeWidth="1.5"/>
                          <path d="M10 16.25C10.4142 16.25 10.75 15.9142 10.75 15.5C10.75 15.0858 10.4142 14.75 10 14.75C9.58579 14.75 9.25 15.0858 9.25 15.5C9.25 15.9142 9.58579 16.25 10 16.25Z" stroke="#64748B" strokeWidth="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/30 flex items-center gap-3">
                    <Link to={`/edit-report/${post.id}`} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-full hover:bg-blue-600/20 transition hover:scale-105">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" /><path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" /></svg>
                      Edit
                    </Link>
                    <Link to={`/view-post/${post.id}`} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white/30 px-3 py-1.5 rounded-full hover:bg-white/50 transition hover:scale-105">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12S4 4 12 4s11 8 11 8-3 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      View
                    </Link>
                    <button onClick={() => { if (confirm("Delete this post?")) { console.log("Delete", post.id); } }} className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition hover:scale-105 ml-auto">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6H21" /><path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" /><path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" /></svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyPosts;
