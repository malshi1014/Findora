import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, setToken } from "../../services/api";
import logo from "../../assets/logo/registration.svg";
import favicon from "../../assets/logo/favicon.ico";

function Register() {
  const navigate = useNavigate();
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
      const payload = { firstName, lastName, email, nic, phone, city, address, password };
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

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-blue-300 flex items-center justify-center p-6">
<div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-[radial-gradient(circle_at_center,_rgba(186,230,253,0.85)_0%,_rgba(96,165,250,0.65)_45%,_rgba(30,64,175,0.95)_100%)] backdrop-blur-2xl shadow-2xl shadow-blue-900/20 animate-fade-up" style={{animationDelay: '0.04s'}}>  

    <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side */}
        <div className="p-10 flex flex-col gap-6 items-start justify-center animate-fade-up" style={{animationDelay: '0.08s'}}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center">
              <img
                src={favicon}
                alt="Findora Logo"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold text-slate-950">Findora</h3>
          </div>

          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-slate-950">
              Join Our Community of Finders.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-900">
              Create an account to report lost items, help others recover their
              valuables and become part of a reliable network dedicated to restoring
              peace of mind.
            </p>
          </div>

          <div className="mt-4 ml-10 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-4 shadow-xl ">
            <img src={logo} alt="register" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 bg-white/20 backdrop-blur-xl border-l border-white/30">
          <div className="max-w-md mx-auto animate-fade-up" style={{animationDelay: '0.12s'}}>
            <h3 className="text-xl font-semibold text-slate-950">
              Create Account
            </h3>
            <p className="text-sm text-slate-800">
              Get started by filling out the details below.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-2xl bg-red-50/80 p-3 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                  style={{animationDelay: '0.16s'}}
                />

                <input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                  style={{animationDelay: '0.18s'}}
                />
              </div>

              <input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                style={{animationDelay: '0.20s'}}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="NIC"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                  style={{animationDelay: '0.22s'}}
                />

                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                  style={{animationDelay: '0.24s'}}
                />
              </div>

              <input
                placeholder="Near City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                style={{animationDelay: '0.26s'}}
              />

              <input
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                style={{animationDelay: '0.28s'}}
              />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                style={{animationDelay: '0.30s'}}
              />

              <input
                placeholder="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 animate-fade-up"
                style={{animationDelay: '0.32s'}}
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="h-4 w-4"
                />
                I agree to the{" "}
                <Link to="#" className="text-blue-700 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-blue-700 font-medium">
                  Privacy Policy
                </Link>
                .
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-up"
                style={{animationDelay: '0.36s'}}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-700 font-medium">
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