import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Settings, ShieldCheck, Database, HardDrive, RefreshCw, BadgeAlert, BadgeCheck } from "lucide-react";

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
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Findora Admin</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">General Settings</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">Manage your platform's core identity and communication hooks.</p>
            </div>

            <div className="w-full lg:max-w-xs">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-xs font-bold text-white flex items-center justify-center">
                    DU
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-xs">Duvindu</p>
                    <p className="text-[10px] text-slate-400">d.@findora.com</p>
                    <p className="mt-1 text-[9px] font-bold text-emerald-600 uppercase tracking-wide">SUPER ADMIN</p>
                  </div>
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                  <p>Last Login • 2m ago • SF, USA</p>
                  <p className="mt-1.5 font-semibold text-slate-500">Security Score <span className="text-emerald-600 font-extrabold">98%</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Settings Forms */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
            <h3 className="text-slate-950 text-lg font-bold">General Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">Edit platform variables and administrative accounts</p>
            
            <div className="mt-5 space-y-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Platform Name</label>
                <input
                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={settings.platformName}
                  onChange={(event) => updateSetting("platformName", event.target.value)}
                />
              </div>
              
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Support Email Address</label>
                <input
                  type="email"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={settings.supportEmail}
                  onChange={(event) => updateSetting("supportEmail", event.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Logo Asset</label>
                <div className="mt-1 flex flex-wrap items-center gap-4">
                  <div className="flex h-20 w-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50/50">
                    SVG or PNG (Max 2MB)
                  </div>
                  <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
            <h4 className="text-slate-950 text-lg font-bold">Security & Access</h4>
            <p className="text-xs text-slate-400 mt-0.5">Control auth constraints and token age limits</p>
            
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Two-Factor Auth</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Biometric or Authenticator app</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">{settings.tfaEnabled ? "ON" : "OFF"}</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.tfaEnabled ? "bg-emerald-500" : "bg-slate-200"}`}
                      onClick={() => updateSetting("tfaEnabled", !settings.tfaEnabled)}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${settings.tfaEnabled ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Session Timeout</label>
                <select
                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                  value={settings.sessionTimeout}
                  onChange={(event) => updateSetting("sessionTimeout", event.target.value)}
                >
                  <option>30 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Device Restriction</label>
                <select
                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                  value={settings.deviceRestriction}
                  onChange={(event) => updateSetting("deviceRestriction", event.target.value)}
                >
                  <option>Strict (Authorized IPs)</option>
                  <option>Lenient</option>
                </select>
              </div>

              <button className="w-full rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                Manage Active Sessions (3)
              </button>
            </div>
          </div>
        </div>

        {/* System Health Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
            <h4 className="text-slate-950 text-lg font-bold">System Health</h4>
            <p className="text-xs text-slate-400 mt-0.5">Database connectivity latency and queues</p>
            
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-150 bg-slate-50/50 p-4 border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-semibold text-slate-400">Database Instance</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                    <Database className="h-4 w-4 text-slate-400" />
                    Latency: 14ms
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <BadgeCheck className="h-4 w-4" />
                  HEALTHY
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-150 bg-slate-50/50 p-4 border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-semibold text-slate-400">Notification API</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                    <HardDrive className="h-4 w-4 text-slate-400" />
                    Queue: 4.2k items
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                  <BadgeAlert className="h-4 w-4" />
                  WARNING
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                <RefreshCw className="h-3.5 w-3.5" />
                Flush Redis Cache
              </button>
              <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                Restart Server Instance
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
            <h4 className="text-slate-950 text-lg font-bold">Profile Info Summary</h4>
            <p className="text-xs text-slate-400 mt-0.5">Admin identity details</p>
            
            <div className="mt-5 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-lg font-bold text-white shadow-xs">
                DU
              </div>
              <p className="mt-4 font-bold text-slate-900">Duvindu Weerathunga</p>
              <p className="text-xs text-slate-400">duvindu@findora.tech</p>
              <span className="mt-3.5 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {statusMessage && !hasChanges && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            {statusMessage}
          </div>
        )}

        {/* Unsaved Sticky Bar */}
        {hasChanges && (
          <div className="sticky bottom-4 z-20 mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between animate-fade-up">
            <div className="text-xs font-bold text-slate-750 text-slate-700">
              You have unsaved changes in: <span className="text-blue-600 font-extrabold">{changedFields.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-655 text-slate-600 hover:bg-slate-50 transition"
                onClick={handleDiscard}
              >
                Discard Changes
              </button>
              <button
                type="button"
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                onClick={handleSaveClick}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-950">Save changes?</h3>
              <p className="mt-2 text-xs text-slate-500">
                You are about to save the current admin settings. Do you want to continue?
              </p>
              <div className="mt-5 flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
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
