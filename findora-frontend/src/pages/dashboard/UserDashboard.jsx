import DashboardLayout from "../../layouts/DashboardLayout";

function UserDashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white py-10">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex-1 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">Dashboard Overview</p>
              <h1 className="mt-4 text-3xl font-bold text-slate-950">Welcome back, Duvindu!</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-700">You have 3 new matches for your lost items. Let's get them back to you.</p>

              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 p-4 shadow-xl">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">✓</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recovery Success!</p>
                  <p className="text-sm text-slate-700">Your Sony Headphones were returned.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">Recent Activity</h4>
                  <div className="mt-2 space-y-4">
                    <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 p-5 shadow-xl">
                      <p className="text-xs text-blue-600">Today, 10:45 AM</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">New Match Found</p>
                      <p className="text-sm text-slate-700 mt-1">A strong match for your "Blue Backpack" in the Transit Hub.</p>
                    </div>

                    <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 p-5 shadow-xl">
                      <p className="text-xs text-purple-600">Yesterday, 4:20 PM</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">Claim Accepted</p>
                      <p className="text-sm text-slate-700 mt-1">The finder of your "House Keys" has verified your claim.</p>
                    </div>

                    <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 p-5 shadow-xl">
                      <p className="text-xs text-slate-500">Mar 10, 2024</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">Post Created</p>
                      <p className="text-sm text-slate-700 mt-1">You reported a "Silver Ring" found in Golden Gate Park.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">My Recent Posts</h4>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 p-4 shadow-xl text-center">
                      <div className="h-16 w-16 mx-auto rounded-md bg-slate-100" />
                      <p className="mt-3 text-sm font-semibold text-slate-950">Blue Backpack</p>
                      <p className="text-xs text-slate-600">Reported: Oct 14, 2023</p>
                    </div>

                    <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 p-4 shadow-xl text-center">
                      <div className="h-16 w-16 mx-auto rounded-md bg-slate-100" />
                      <p className="mt-3 text-sm font-semibold text-slate-950">Car Keys</p>
                      <p className="text-xs text-slate-600">Reported: Oct 12, 2023</p>
                    </div>

                    <button className="rounded-3xl bg-white/30 backdrop-blur-xl border border-dashed border-white/40 p-4 shadow-xl flex items-center justify-center text-lg font-bold text-slate-700 transition hover:bg-white/40">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="w-full max-w-sm">
              <div className="rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg p-6">
                <h4 className="text-sm font-semibold text-slate-900">Profile Strength</h4>
                <p className="mt-2 text-2xl font-bold text-blue-600">85%</p>
                <p className="mt-3 text-sm text-slate-700">Complete your identity verification to increase your trust score among the Findora community.</p>
                <button className="mt-4 bg-blue-600/90 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-700">
                  Verify Identity Now
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;
