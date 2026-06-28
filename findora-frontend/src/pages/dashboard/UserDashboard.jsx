import DashboardLayout from "../../layouts/DashboardLayout";

function UserDashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #bfdbfe 100%)" }}>
        {/* Decorative blur orbs */}
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[2160px] mx-auto p-8 flex flex-col gap-8">

          {/* Dashboard Overview + Profile Strength Row */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Dashboard Overview Card */}
            <div className="flex-1 p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 relative overflow-hidden">
              <div className="flex flex-col gap-4">
                <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">
                  DASHBOARD OVERVIEW
                </span>
                <h1 className="text-slate-950 text-3xl font-bold leading-tight">
                  Welcome back, Duvindu!
                </h1>
                <p className="text-slate-600 text-base leading-7 max-w-[640px]">
                  You have <span className="text-blue-600 font-semibold">3 new matches</span> for your lost items. Let&apos;s get them back to you.
                </p>
                <div className="flex items-center gap-5 p-5 bg-white/25 backdrop-blur rounded-2xl border border-white/30 max-w-[520px] hover:-translate-y-0.5 transition">
                  <div className="w-14 h-14 bg-blue-600/15 rounded-2xl flex items-center justify-center shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-700 text-base font-bold">Recovery Success!</p>
                    <p className="text-slate-500 text-sm font-medium">Your Sony Headphones were returned.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Strength Card */}
            <div className="w-full lg:w-[380px] p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex flex-col justify-between">
              <div className="flex flex-col gap-5 pb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-slate-950 text-xl font-semibold">Profile Strength</h2>
                  <span className="text-blue-600 text-xl font-bold">85%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-gradient-to-r from-blue-600 to-violet-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
                </div>
                <p className="text-slate-500 text-sm leading-7">
                  Complete your identity verification to increase your trust score among the Findora community.
                </p>
              </div>
              <button className="w-full rounded-full border border-blue-600/30 bg-white/40 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50/50">
                Verify Identity Now
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex flex-col gap-6">
            <h2 className="text-slate-950 text-xl font-semibold">Recent Activity</h2>

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex flex-col gap-7">
              {/* Activity Item 1 */}
              <div className="relative pl-10 pb-7 border-l border-slate-200/70 flex flex-col gap-1.5">
                <div className="absolute -left-[7px] top-0 w-[14px] h-[14px] rounded-full bg-blue-600 shadow-[0_0_0_5px_rgba(37,99,235,0.15)]" />
                <p className="text-blue-700 text-xs font-semibold uppercase tracking-[0.2em]">TODAY, 10:45 AM</p>
                <p className="text-slate-950 text-base font-bold">New Match Found</p>
                <p className="text-slate-500 text-sm leading-6">
                  AI detected a strong match for your &quot;Blue Backpack&quot; in the Transit hub.
                </p>
              </div>

              {/* Activity Item 2 */}
              <div className="relative pl-10 pb-7 border-l border-slate-200/70 flex flex-col gap-1.5">
                <div className="absolute -left-[7px] top-0 w-[14px] h-[14px] rounded-full bg-violet-500 shadow-[0_0_0_5px_rgba(139,92,246,0.15)]" />
                <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em]">YESTERDAY, 4:20 PM</p>
                <p className="text-slate-950 text-base font-bold">Claim Accepted</p>
                <p className="text-slate-500 text-sm leading-6">
                  The finder of your &quot;House Keys&quot; has verified your claim.
                </p>
              </div>

              {/* Activity Item 3 */}
              <div className="relative pl-10 border-l border-slate-200/70 flex flex-col gap-1.5">
                <div className="absolute -left-[7px] top-0 w-[14px] h-[14px] rounded-full bg-slate-400 shadow-[0_0_0_5px_rgba(148,163,184,0.15)]" />
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.2em]">OCT 12, 9:00 AM</p>
                <p className="text-slate-950 text-base font-bold">Post Created</p>
                <p className="text-slate-500 text-sm leading-6">
                  You reported a &quot;Silver Ring&quot; found in Golden Gate Park.
                </p>
              </div>
            </div>
          </div>

          {/* My Recent Posts */}
          <div className="flex flex-col gap-6 pb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-slate-950 text-xl font-semibold">My Recent Posts</h2>
              <span className="text-blue-600 text-sm font-semibold cursor-pointer hover:text-blue-700 transition">View All Posts</span>
            </div>

            <div className="flex flex-col gap-5">
              {/* Post 1 */}
              <div className="flex items-center gap-5 p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:-translate-y-0.5 transition">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200/50 shrink-0 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#CBD5E1"/>
                    <path d="M4 20L10 12L14 16L18 8L22 14V20H4Z" fill="#94A3B8"/>
                  </svg>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-slate-950 text-base font-bold">Blue Backpack</h3>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.1em] mt-0.5">Reported: Oct 14, 2023</p>
                    </div>
                    <span className="px-3 py-0.5 bg-violet-500/10 rounded text-violet-600 text-xs font-bold uppercase tracking-[0.1em]">LOST</span>
                  </div>
                </div>
              </div>

              {/* Post 2 */}
              <div className="flex items-center gap-5 p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:-translate-y-0.5 transition">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200/50 shrink-0 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#CBD5E1"/>
                    <path d="M4 20L10 12L14 16L18 8L22 14V20H4Z" fill="#94A3B8"/>
                  </svg>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-slate-950 text-base font-bold">Car Keys</h3>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.1em] mt-0.5">Reported: Oct 12, 2023</p>
                    </div>
                    <span className="px-3 py-0.5 bg-blue-600/10 rounded text-blue-600 text-xs font-bold uppercase tracking-[0.1em]">FOUND</span>
                  </div>
                </div>
              </div>

              {/* Add New Post */}
              <div className="flex items-center gap-5 p-5 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-dashed border-blue-300/50 shadow-xl shadow-blue-600/5 cursor-pointer hover:-translate-y-0.5 hover:bg-white/40 transition">
                <div className="w-24 h-24 rounded-2xl bg-slate-100/50 flex items-center justify-center shrink-0">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-slate-700 text-base font-semibold">Report another item...</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;
