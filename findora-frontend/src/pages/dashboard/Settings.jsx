import { useState, useEffect } from "react";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return Math.min(strength, 3);
};

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];
const STRENGTH_BAR    = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-400"];

function Settings() {
  const [user, setUser] = useState(null);

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [mobile,    setMobile]    = useState("");
  const [district,  setDistrict]  = useState("");
  const [nearTown,  setNearTown]  = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("findora_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setFirstName(parsed.first_name || "");
        setLastName(parsed.last_name  || "");
        setMobile(parsed.mobile    || "");
        setDistrict(parsed.district  || "");
        setNearTown(parsed.nearest_town || "");
      }
    } catch {
      // ignore
    }
  }, []);

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";
  const strength = getPasswordStrength(newPassword);

  // ── Save Profile ──────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return;
    if (!firstName.trim() || !lastName.trim()) {
      setProfileStatus({ type: "error", message: "First and last name are required." });
      return;
    }

    setSavingProfile(true);
    setProfileStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/auth/update_profile.php`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:      user.user_id,
          first_name:   firstName.trim(),
          last_name:    lastName.trim(),
          mobile:       mobile.trim(),
          district:     district.trim(),
          nearest_town: nearTown.trim(),
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        // Persist updated user back to localStorage
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("findora_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfileStatus({ type: "success", message: "Profile updated successfully!" });
      } else {
        setProfileStatus({ type: "error", message: data.message || "Failed to update profile." });
      }
    } catch {
      setProfileStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change Password ───────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: "error", message: "All password fields are required." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setSavingPassword(true);
    setPasswordStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change_password.php`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:          user.user_id,
          current_password: currentPassword,
          new_password:     newPassword,
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setPasswordStatus({ type: "success", message: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({ type: "error", message: data.message || "Failed to change password." });
      }
    } catch {
      setPasswordStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSavingPassword(false);
    }
  };

  const statusClass = (type) =>
    type === "success"
      ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
      : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700";

  return (
    <RoleBasedLayout>
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your profile and account security.</p>
        </div>

        {/* ── Profile Card ────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-md">
          <div className="flex items-start gap-6 pb-6 border-b border-slate-100">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>
              <p className="mt-1 text-sm text-slate-500">Update your personal details below.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email — read-only */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Cannot be changed
                </span>
              </label>
              <input
                value={user?.email ?? ""}
                readOnly
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-100 bg-slate-100 px-4 py-3 text-sm text-slate-400 outline-none"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+94 77 000 0000"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">District</label>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Colombo"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Nearest Town</label>
              <input
                value={nearTown}
                onChange={(e) => setNearTown(e.target.value)}
                placeholder="e.g. Nugegoda"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {profileStatus.message && (
              <p className={statusClass(profileStatus.type)}>{profileStatus.message}</p>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {savingProfile ? "Saving…" : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Password Card ────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-md">
          <div className="pb-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <p className="mt-1 text-sm text-slate-500">Use a strong password with at least 8 characters.</p>
          </div>

          <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i <= strength - 1 ? STRENGTH_BAR[strength - 1] : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${STRENGTH_COLORS[strength - 1] ?? "text-slate-400"}`}>
                      {STRENGTH_LABELS[strength - 1] ?? "Too short"}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>
            </div>

            {passwordStatus.message && (
              <p className={statusClass(passwordStatus.type)}>{passwordStatus.message}</p>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={savingPassword}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {savingPassword ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </RoleBasedLayout>
  );
}

export default Settings;