import AdminLayout from "../../layouts/AdminLayout";

function ManageSettings() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-12">
        <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Findora Admin</p>
              <h1 className="mt-4 text-4xl font-semibold">General Settings</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">Manage your platform's core identity and communication hooks.</p>
            </div>

            <div className="w-full max-w-sm">
              <div className="rounded-[1rem] bg-slate-900/90 p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-800/50" />
                  <div>
                    <p className="text-white font-semibold">Duvindu</p>
                    <p className="text-xs text-slate-400">d.@findora.com</p>
                    <p className="mt-2 text-xs text-emerald-300">SUPER ADMIN</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  <p>Last Login • 2m ago • SF, USA</p>
                  <p className="mt-2">Security Score <span className="text-emerald-400 font-semibold">98%</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-2 rounded-[1.5rem] bg-slate-950/95 p-6 shadow-lg">
            <h3 className="text-white text-lg font-semibold">General Settings</h3>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Platform Name</label>
                <input className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none" defaultValue="Findora" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Support Email Address</label>
                <input className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none" defaultValue="support@findora.enterprise" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Logo Asset</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-24 w-48 rounded-md border-2 border-dashed border-slate-800/60 flex items-center justify-center text-sm text-slate-500">SVG or PNG (Max 2MB)</div>
                  <button className="rounded-md bg-slate-900/80 px-4 py-2 text-sm text-slate-200">Upload</button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-950/95 p-6 shadow-lg">
            <h4 className="text-white text-lg font-semibold">Security & Access</h4>
            <div className="mt-4 space-y-4">
              <div className="rounded-md bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400">Biometric or Authenticator App required</p>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm text-slate-400">OFF</span>
                    <button className="h-6 w-12 rounded-full bg-emerald-500/80" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Session Timeout</label>
                <select className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none">
                  <option>30 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Device Restriction</label>
                <select className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none">
                  <option>Strict (Authorized IPs)</option>
                  <option>Lenient</option>
                </select>
              </div>

              <button className="mt-2 rounded-md border border-slate-800 px-4 py-2 text-sm text-slate-200">Manage Active Sessions (3)</button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-950/95 p-6 shadow-lg">
            <h4 className="text-white text-lg font-semibold">System Health</h4>
            <div className="mt-4 grid gap-4">
              <div className="rounded-md bg-slate-900/80 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Database Instance</p>
                  <p className="text-white font-semibold">Latency: 14ms</p>
                </div>
                <div className="text-emerald-400 font-semibold">HEALTHY</div>
              </div>

              <div className="rounded-md bg-slate-900/80 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Notification API</p>
                  <p className="text-white font-semibold">Queue: 4.2k items</p>
                </div>
                <div className="text-amber-400 font-semibold">WARNING</div>
              </div>

              <div className="flex gap-3">
                <button className="rounded-md border border-slate-800 px-4 py-2 text-sm text-slate-200">Flush Cache</button>
                <button className="rounded-md border border-slate-800 px-4 py-2 text-sm text-slate-200">Restart Node</button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-950/95 p-6 shadow-lg">
            <h4 className="text-white text-lg font-semibold">Profile</h4>
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-slate-800/60" />
              <p className="mt-4 text-white font-semibold">Duvindu</p>
              <p className="text-sm text-slate-400">d.@findora.com</p>
              <p className="mt-2 text-xs text-emerald-300">SUPER ADMIN</p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 z-50 w-[90%] -translate-x-1/2 max-w-7xl">
          <div className="rounded-full bg-slate-900/90 p-4 shadow-2xl flex items-center justify-between">
            <div className="text-sm text-slate-300">You have 4 unsaved changes in Rewards and Security</div>
            <div className="flex items-center gap-3">
              <button className="rounded-md border border-slate-800 px-4 py-2 text-sm text-slate-200">Discard Changes</button>
              <button className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageSettings;
