import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Settings, ShieldCheck, Database, HardDrive, RefreshCw, BadgeAlert, BadgeCheck } from "lucide-react";

const initialSettings = {
  platformName: "Findora",
  supportEmail: "support@findora.software",
  sessionTimeout: "30", // in minutes
  logoAsset: null,
};

function ManageSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("findora_admin_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        setSavedSettings(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

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
    localStorage.setItem("findora_admin_settings", JSON.stringify(settings));
    setShowConfirmModal(false);
    setStatusMessage("Settings saved successfully.");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File must be smaller than 2MB");
        return;
      }
      updateSetting("logoAsset", file.name);
    }
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
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">Manage your platform's core identity and configuration.</p>
            </div>
          </div>
        </section>

        {/* Main Settings Forms */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
            <h3 className="text-slate-950 text-lg font-bold">General Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">Edit platform variables and administrative details</p>
            
            <div className="mt-5 space-y-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">
                  Platform Name
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Cannot be changed
                  </span>
                </label>
                <input
                  readOnly
                  disabled
                  className="rounded-xl border border-slate-100 bg-slate-100 p-3 text-xs text-slate-400 outline-none cursor-not-allowed"
                  value={settings.platformName}
                />
              </div>
              
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Support Email Address</label>
                <input
                  type="email"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={settings.supportEmail}
                  onChange={(event) => updateSetting("supportEmail", event.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Logo Asset</label>
                <div className="mt-1 flex flex-wrap items-center gap-4">
                  <div className="flex h-20 w-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50/50 overflow-hidden text-center p-2">
                    {settings.logoAsset ? (
                      <span className="text-blue-600">{settings.logoAsset}</span>
                    ) : (
                      "SVG or PNG (Max 2MB)"
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".png, .svg"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md h-fit">
            <h4 className="text-slate-950 text-lg font-bold">Security & Access</h4>
            <p className="text-xs text-slate-400 mt-0.5">Control session token age limits</p>
            
            <div className="mt-5 space-y-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Session Timeout</label>
                <select
                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 transition"
                  value={settings.sessionTimeout}
                  onChange={(event) => updateSetting("sessionTimeout", event.target.value)}
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">2 Hours</option>
                </select>
                <p className="text-[10px] text-slate-400">
                  Admins will be logged out after this period of inactivity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {statusMessage && !hasChanges && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-up">
            {statusMessage}
          </div>
        )}

        {/* Unsaved Sticky Bar */}
        {hasChanges && (
          <div className="sticky bottom-4 z-20 mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between animate-fade-up">
            <div className="text-xs font-bold text-slate-700">
              You have unsaved changes.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
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
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-up">
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
                  className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition"
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
