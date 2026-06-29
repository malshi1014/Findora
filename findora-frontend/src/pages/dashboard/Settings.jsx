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
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { firstName, lastName, email, phone, city, address };
    console.log("settings payload", payload);
    alert("Settings saved successfully!");
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
  const strengthColor = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"][getPasswordStrength()];
  const strengthWidth = ["25%", "50%", "75%", "100%"][getPasswordStrength()];

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">Account</span>
                  <h1 className="mt-4 text-3xl font-bold text-slate-950">Settings</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Manage your profile, security, and notification preferences.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/40 backdrop-blur px-4 py-3 shadow-sm shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white text-lg font-bold">D</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                    <p className="text-sm text-slate-500">Settings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex items-start gap-6 pb-8 border-b border-white/30">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg">
                  D
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">Profile Settings</h3>
                  <p className="mt-1 text-sm text-slate-500">Update your profile information</p>
                  <button className="mt-3 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-600/20 transition">
                    Update Photo
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="mt-8 space-y-7">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">First Name</span>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Last Name</span>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Email Address</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Phone Number</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Near City</span>
                    <input value={city} onChange={(e) => setCity(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Address</span>
                  <input value={address} onChange={(e) => setAddress(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </label>

                <div className="pt-6 border-t border-white/30 space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Account Security</h3>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Current Password</span>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                        className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">New Password</span>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password"
                        className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  {newPassword && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Password Strength: <span className="font-semibold text-slate-700">{strengthLabel}</span></span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/40 backdrop-blur overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: strengthWidth }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/20 backdrop-blur px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                    </div>
                    <button type="button" onClick={() => setTwoFactor(!twoFactor)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${twoFactor ? 'bg-blue-600' : 'bg-white/40 border border-white/40'}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/30 space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>

                  <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/20 backdrop-blur px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-500 mt-0.5">Receive updates about matches and activity on your reports.</p>
                    </div>
                    <button type="button" onClick={() => setEmailNotifs(!emailNotifs)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${emailNotifs ? 'bg-blue-600' : 'bg-white/40 border border-white/40'}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${emailNotifs ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit"
                    className="flex-1 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => { setFirstName("Duvindu"); setLastName("Kavishka"); setEmail("duvindu.sath.ug@gmail.com"); setPhone("+94 00 000-0000"); setCity("Melilou"); setAddress("Street, Apartment, City"); setCurrentPassword(""); setNewPassword(""); }}
                    className="flex-1 rounded-full bg-white/40 backdrop-blur border border-white/40 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white/60">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
