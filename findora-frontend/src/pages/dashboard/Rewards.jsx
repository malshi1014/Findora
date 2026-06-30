import DashboardLayout from "../../layouts/DashboardLayout";

function Rewards() {
  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">Recognition</span>
                  <h1 className="mt-4 text-3xl font-bold text-slate-950">My Rewards</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Earn recognition and rewards by helping reunite lost items, pets, and people. Every contribution makes a difference.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/40 backdrop-blur px-4 py-3 shadow-sm shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white text-lg font-bold">D</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                    <p className="text-sm text-slate-500">Level 2</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-blue-700">Total Recoveries</p>
                <p className="mt-2 text-4xl font-bold text-slate-950">2</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-blue-700">Rewards Earned</p>
                <p className="mt-2 text-4xl font-bold text-slate-950">0</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-blue-700">Community Rank</p>
                <p className="mt-2 text-4xl font-bold text-slate-950">#124</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
              <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex flex-col gap-5">
                <span className="text-xs font-semibold uppercase tracking-[1.2px] text-blue-700">Next Milestone</span>
                <h3 className="text-2xl font-semibold text-slate-900">Rs.100 Mobile Reload</h3>
                <p className="text-sm leading-relaxed text-slate-600">You are just one successful recovery away from claiming your next reward. Keep an eye on local missing reports to help out!</p>
                <button className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-xs font-semibold uppercase tracking-[0.6px] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition mt-auto">
                  Claim Reward
                </button>
              </div>

              <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Badges</h3>
                  <button className="text-blue-600 text-xs font-semibold hover:underline">View All Badges</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-6 rounded-2xl bg-white/30 backdrop-blur border border-white/40 flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#221B00"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.6px] text-slate-800">First Recovery</p>
                      <p className="text-slate-500 text-[10px] mt-1">Unlocked</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/20 backdrop-blur border border-white/20 flex flex-col items-center text-center gap-3 opacity-60">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#8D90A0"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.6px] text-slate-600">Top Contributor</p>
                      <p className="text-slate-400 text-[10px] mt-1">Locked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Rewards;
