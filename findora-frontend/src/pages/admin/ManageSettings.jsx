import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

const initialSettings = {
  platformName: "Findora",
  supportEmail: "support@findora.enterprise",
  tfaEnabled: false,
  sessionTimeout: "30 Minutes",
  deviceRestriction: "Strict (Authorized IPs)",
};

function ManageSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const changedFields = Object.keys(settings).filter((key) => settings[key] !== savedSettings[key]);
  const hasChanges = changedFields.length > 0;

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setStatusMessage("");
  };

  const handleDiscard = () => {
    setSettings(savedSettings);
    setStatusMessage("");
  };

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    setSavedSettings(settings);
    setShowConfirmModal(false);
    setStatusMessage("Settings saved successfully.");
  };

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
                <input
                  className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none"
                  value={settings.platformName}
                  onChange={(event) => updateSetting("platformName", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Support Email Address</label>
                <input
                  type="email"
                  className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none"
                  value={settings.supportEmail}
                  onChange={(event) => updateSetting("supportEmail", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Logo Asset</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex h-24 w-48 items-center justify-center rounded-md border-2 border-dashed border-slate-800/60 text-sm text-slate-500">SVG or PNG (Max 2MB)</div>
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
                    <span className="text-sm text-slate-400">{settings.tfaEnabled ? "ON" : "OFF"}</span>
                    <button
                      type="button"
                      className={`h-6 w-12 rounded-full transition ${settings.tfaEnabled ? "bg-emerald-500/80" : "bg-slate-700"}`}
                      onClick={() => updateSetting("tfaEnabled", !settings.tfaEnabled)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Session Timeout</label>
                <select
                  className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none"
                  value={settings.sessionTimeout}
                  onChange={(event) => updateSetting("sessionTimeout", event.target.value)}
                >
                  <option>30 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-slate-400">Device Restriction</label>
                <select
                  className="rounded-md border border-slate-800 bg-slate-900/95 p-3 text-sm text-white outline-none"
                  value={settings.deviceRestriction}
                  onChange={(event) => updateSetting("deviceRestriction", event.target.value)}
                >
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
              <div className="flex items-center justify-between rounded-md bg-slate-900/80 p-4">
                <div>
                  <p className="text-sm text-slate-400">Database Instance</p>
                  <p className="font-semibold text-white">Latency: 14ms</p>
                </div>
                <div className="font-semibold text-emerald-400">HEALTHY</div>
              </div>

              <div className="flex items-center justify-between rounded-md bg-slate-900/80 p-4">
                <div>
                  <p className="text-sm text-slate-400">Notification API</p>
                  <p className="font-semibold text-white">Queue: 4.2k items</p>
                </div>
                <div className="font-semibold text-amber-400">WARNING</div>
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
              <p className="mt-4 font-semibold text-white">Duvindu</p>
              <p className="text-sm text-slate-400">d.@findora.com</p>
              <p className="mt-2 text-xs text-emerald-300">SUPER ADMIN</p>
            </div>
          </div>
        </div>

        {statusMessage && !hasChanges && (
          <div className="rounded-md border border-emerald-700/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {statusMessage}
          </div>
        )}

        {hasChanges && (
          <div className="sticky bottom-4 z-20 mt-8 flex flex-col gap-3 rounded-full border border-slate-800/80 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-300">
              You have {changedFields.length} unsaved change{changedFields.length === 1 ? "" : "s"}
              {changedFields.length > 0 ? ` in ${changedFields.join(", ")}` : ""}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-slate-800 px-4 py-2 text-sm text-slate-200"
                onClick={handleDiscard}
              >
                Discard Changes
              </button>
              <button
                type="button"
                className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={handleSaveClick}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white">Save changes?</h3>
              <p className="mt-2 text-sm text-slate-400">
                You are about to save the current admin settings. Do you want to continue?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
                  onClick={confirmSave}
                >
                  Confirm Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageSettings;
