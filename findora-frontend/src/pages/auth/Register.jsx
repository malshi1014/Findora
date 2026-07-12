import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService, setToken } from "../../services/api";
import logo from "../../assets/logo/registration.svg";
import favicon from "../../assets/logo/favicon.ico";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "user";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!firstName || !lastName || !email || !nic || !phone || !city || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = { firstName, lastName, email, nic, phone, city, address, password, role };
      const response = await authService.register(payload);

      if (response.token) {
        setToken(response.token);
        alert("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="h-screen overflow-hidden relative flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #ffffff 0%, #7ec0fc 100%)" }}>
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl h-full max-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-600/5">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">

          <div className="p-8 xl:p-10 flex flex-col gap-5 items-start justify-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center">
                <img src={favicon} alt="Findora Logo" className="h-full w-full object-contain rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Findora</h3>
            </div>

            <div className="max-w-md">
              <h2 className="text-2xl xl:text-3xl font-bold text-slate-900">
                Join Our Community of Finders.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create an account to report lost items, help others recover their
                valuables and become part of a reliable network dedicated to restoring
                peace of mind.
              </p>
            </div>

            <div className="mt-3 ml-10 rounded-[2rem] border border-white/40 bg-white/20 backdrop-blur-xl p-4 shadow-xl max-h-48">
              <img src={logo} alt="register" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="p-6 xl:p-8 bg-white/20 backdrop-blur-xl border-l border-white/30 overflow-y-auto">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg xl:text-xl font-semibold text-slate-900">
                Create Account
              </h3>
              <p className="text-sm text-slate-500">
                Get started by filling out the details below.
              </p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-white/40 text-slate-700 border border-white/30">
                Signing up as: {role === "shop" ? "Shop Owner" : "Normal User"}
              </span>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                {error && (
                  <div className="rounded-2xl bg-red-50/80 p-3.5 text-sm text-red-600 border border-red-200 flex items-start gap-2.5">
                    <svg className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">{role === "shop" ? "Name" : "First Name"}</span>
                    <input placeholder={role === "shop" ? "Name" : "First Name"} value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">{role === "shop" ? "Shop Name" : "Last Name"}</span>
                    <input placeholder={role === "shop" ? "Shop Name" : "Last Name"} value={lastName} onChange={(e) => setLastName(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Email Address</span>
                  <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">NIC</span>
                    <input placeholder="NIC" value={nic} onChange={(e) => setNic(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Phone Number</span>
                    <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Near City</span>
                    <input placeholder="Near City" value={city} onChange={(e) => setCity(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Address <span className="font-normal text-slate-400">(Optional)</span></span>
                    <input placeholder="Address (Optional)" value={address} onChange={(e) => setAddress(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Password</span>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
                    <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  </label>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700 pt-1">
                  <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)}
                    className="h-4 w-4 rounded border-white/40 bg-white/40" />
                  I agree to the{" "}
                  <Link to="#" className="text-blue-600 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-blue-600 font-medium">
                    Privacy Policy
                  </Link>
                  .
                </label>

                <button type="submit" disabled={loading}
                  className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 font-semibold">
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
