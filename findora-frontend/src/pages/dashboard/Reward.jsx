import DashboardLayout from "../../layouts/DashboardLayout";

function Reward() {
  const stats = [
    { title: "Total Recoveries", value: 2 },
    { title: "Rewards Earned", value: 0 },
    { title: "Current Points", value: 850 },
    { title: "Community Rank", value: "#124" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="rounded-lg bg-linear-to-r from-sky-100 to-sky-300 p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-slate-800">My Rewards</h2>
          <p className="mt-2 text-sm text-slate-600">Earn recognition and rewards by helping reunite lost items, pets, and people.</p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.title} className="rounded-md bg-white p-4 shadow">
              <p className="text-xs text-slate-500">{s.title}</p>
              <p className="mt-2 text-2xl font-bold text-sky-600">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2 rounded-md bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-slate-700">Next Milestone</h3>
            <p className="mt-2 text-sm text-slate-500">Rs.100 Mobile Reload</p>
            <p className="mt-4 text-sm text-slate-600">You are just one successful recovery away from claiming your next reward. Keep an eye on local missing reports to help out!</p>
            <button className="mt-6 rounded bg-sky-600 px-4 py-2 text-white">Claim Reward</button>
          </div>

          <aside className="rounded-md bg-white p-6 shadow">
            <h4 className="text-sm font-semibold text-slate-700">Recent Badges</h4>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-3 rounded-md border border-slate-100 p-3">
                <div className="h-12 w-12 rounded bg-sky-100 flex items-center justify-center text-sky-700">🏅</div>
                <div>
                  <p className="font-semibold text-slate-800">First Recovery</p>
                  <p className="text-xs text-slate-500">Unlocked</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-md border border-slate-100 p-3 opacity-60">
                <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-slate-500">🔒</div>
                <div>
                  <p className="font-semibold text-slate-800">Top Contributor</p>
                  <p className="text-xs text-slate-500">Locked</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reward;
