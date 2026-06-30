import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function UserDashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div>
                <h1 className="text-4xl font-bold text-slate-950">Hey Duvindu</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Track your reports, matches, and recent activity all in one place.</p>
              </div>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center hover:-translate-y-0.5 transition">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"><path d="M12 5V19M5 12H19" /></svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">Total Reports</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">7</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center hover:-translate-y-0.5 transition">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 12H15M12 9V15" /></svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">Active Matches</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">3</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center hover:-translate-y-0.5 transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"><path d="M9 12L11 14L15 10" /><circle cx="12" cy="12" r="9" /></svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">Recoveries</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">2</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center hover:-translate-y-0.5 transition">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">Rewards Earned</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
              <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[1.2px] text-blue-700">Recent Activity</span>
                  <span className="text-blue-600 text-xs font-semibold cursor-pointer hover:underline">View All</span>
                </div>

                <div className="relative pl-10 pb-6 border-l border-slate-200/70 flex flex-col gap-1.5">
                  <div className="absolute -left-[7px] top-0 w-[14px] h-[14px] rounded-full bg-blue-600 shadow-[0_0_0_5px_rgba(37,99,235,0.15)]" />
                  <p className="text-blue-700 text-xs font-semibold uppercase tracking-[0.2em]">TODAY, 10:45 AM</p>
                  <p className="text-slate-950 text-sm font-bold">New Match Found</p>
                  <p className="text-slate-500 text-xs leading-5">AI detected a strong match for your &quot;Blue Backpack&quot; in the Transit hub.</p>
                </div>

                <div className="relative pl-10 pb-6 border-l border-slate-200/70 flex flex-col gap-1.5">
                  <div className="absolute -left-[7px] top-0 w-[14px] h-[14px] rounded-full bg-violet-500 shadow-[0_0_0_5px_rgba(139,92,246,0.15)]" />
                  <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em]">YESTERDAY, 4:20 PM</p>
                  <p className="text-slate-950 text-sm font-bold">Claim Accepted</p>
                  <p className="text-slate-500 text-xs leading-5">The finder of your &quot;House Keys&quot; has verified your claim.</p>
                </div>

                <div className="relative pl-10 border-l border-slate-200/70 flex flex-col gap-1.5">
                  <div className="absolute -left-[7px] top-0 w-[14px] h-[14px] rounded-full bg-slate-400 shadow-[0_0_0_5px_rgba(148,163,184,0.15)]" />
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.2em]">OCT 12, 9:00 AM</p>
                  <p className="text-slate-950 text-sm font-bold">Post Created</p>
                  <p className="text-slate-500 text-xs leading-5">You reported a &quot;Silver Ring&quot; found in Golden Gate Park.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[1.2px] text-blue-700">Recent Notifications</span>
                  <Link to="/notifications" className="text-blue-600 text-xs font-semibold hover:underline">View All</Link>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex items-center gap-4 hover:bg-white/40 transition">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">M</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Possible match found</p>
                          <p className="mt-0.5 text-xs text-slate-600">A few minutes ago, we found a match for your report.</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 shrink-0">2d ago</span>
                      </div>
                      <button className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">View Details &rarr;</button>
                    </div>
                  </div>

                  <div className="p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex items-center gap-4 hover:bg-white/40 transition">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">C</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">New claim request</p>
                          <p className="mt-0.5 text-xs text-slate-600">Someone has submitted a claim for your found item.</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 shrink-0">5h ago</span>
                      </div>
                      <button className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">Review Request &rarr;</button>
                    </div>
                  </div>

                  <div className="p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex items-center gap-4 hover:bg-white/40 transition">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">S</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Sarah Chen commented</p>
                          <p className="mt-0.5 text-xs text-slate-600">Commented on your lost pet post.</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 shrink-0">6h ago</span>
                      </div>
                      <button className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">View Post &rarr;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[1.2px] text-blue-700">My Reports</span>
                <Link to="/my-posts" className="text-blue-600 text-xs font-semibold hover:underline">View All Posts</Link>
              </div>

              <div className="space-y-4">
                <div className="p-5 sm:p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:bg-white/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <span className="w-16 sm:w-20 text-center px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-rose-50 text-rose-600">Lost</span>
                      <div>
                        <p className="text-slate-900 text-base sm:text-xl font-bold leading-snug">Blue Backpack</p>
                        <p className="text-slate-400 text-xs mt-0.5">Central Park Cafe &middot; Oct 14, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-xs text-slate-400">145 views</span>
                      <Link to="/matches" className="text-blue-600 text-xs sm:text-sm font-semibold hover:underline">2 matches</Link>
                      <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Active</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/30 flex items-center gap-3">
                    <Link to="/edit-report/1" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-full hover:bg-blue-600/20 transition hover:scale-105">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" /><path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" /></svg>
                      Edit
                    </Link>
                    <Link to="/view-post/1" className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white/30 px-3 py-1.5 rounded-full hover:bg-white/50 transition hover:scale-105">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12S4 4 12 4s11 8 11 8-3 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      View
                    </Link>
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:bg-white/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <span className="w-16 sm:w-20 text-center px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-600">Found</span>
                      <div>
                        <p className="text-slate-900 text-base sm:text-xl font-bold leading-snug">Car Keys</p>
                        <p className="text-slate-400 text-xs mt-0.5">Main Street Station &middot; Oct 12, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-xs text-slate-400">89 views</span>
                      <Link to="/matches" className="text-blue-600 text-xs sm:text-sm font-semibold hover:underline">1 match</Link>
                      <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Active</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/30 flex items-center gap-3">
                    <Link to="/edit-report/2" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-full hover:bg-blue-600/20 transition hover:scale-105">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" /><path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" /></svg>
                      Edit
                    </Link>
                    <Link to="/view-post/2" className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white/30 px-3 py-1.5 rounded-full hover:bg-white/50 transition hover:scale-105">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12S4 4 12 4s11 8 11 8-3 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      View
                    </Link>
                  </div>
                </div>

                <Link to="/report-lost" className="flex items-center gap-5 p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-dashed border-blue-300/50 shadow-xl shadow-blue-600/5 cursor-pointer hover:-translate-y-0.5 hover:bg-white/40 transition">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100/50 flex items-center justify-center shrink-0">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-700 text-base font-semibold">Report another item...</p>
                    <p className="text-slate-400 text-xs mt-1">Submit a new lost or found report</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;
