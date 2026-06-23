import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Settings() {
  const [firstName, setFirstName] = useState("Duvindu");
  const [lastName, setLastName] = useState("Kavishka");
  const [email, setEmail] = useState("duvindu.sath.ug@gmail.com");
  const [phone, setPhone] = useState("+94 00 000-0000");
  const [city, setCity] = useState("Melilou");
  const [address, setAddress] = useState("Street, Apartment, City");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { firstName, lastName, email, phone, city, address };
    console.log("settings payload", payload);
    alert("Settings saved (stub)");
  };

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength++;
    return Math.min(strength, 3);
  };

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][getPasswordStrength()];
  const strengthColor = ["text-red-400", "text-yellow-400", "text-blue-400", "text-green-400"][getPasswordStrength()];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

        <div className="mt-8 space-y-8">
          {/* Profile Settings */}
          <div className="rounded-4xl bg-white p-8 shadow-xl">
            <div className="flex items-start gap-6 pb-8 border-b border-slate-200">
              <div className="h-24 w-24 rounded-full bg-linear-to-br from-cyan-300 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                D
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">Profile Settings</h3>
                <p className="mt-1 text-sm text-slate-500">Update your profile information</p>
                <button className="mt-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                  UPDATE PHOTO
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Near City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Address (Optional)</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Account Security */}
              <div className="mt-8 space-y-6 border-t border-slate-200 pt-8">
                <h3 className="text-lg font-semibold text-slate-900">Account Security</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Change Password</label>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <div>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      {newPassword && (
                        <div className="mt-2 text-xs text-slate-600">
                          Strength: <span className={`font-semibold ${strengthColor}`}>{strengthLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-200 pt-8">
                <button
                  type="button"
                  className="rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-auto rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;