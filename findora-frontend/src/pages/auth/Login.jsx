// src/pages/auth/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, setToken } from "../../services/api";
import logo from "../../assets/logo/12953560_Data_security_01.svg";
import favicon from "../../assets/logo/favicon.ico";

function Login() {
  const navigate = useNavigate();
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!nic || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const response = await authService.login(nic, password);
      
      if (response.token) {
        setToken(response.token);
        if (remember) {
          localStorage.setItem("rememberMe", "true");
        }
        alert("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-white to-blue-700 flex items-center justify-center p-6">
      
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/40 bg-blue-300 backdrop-blur-2xl shadow-2xl shadow-blue-900/20 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 flex flex-col items-center justify-center gap-3" style={{animationDelay: '0.06s'}}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src={favicon} alt="Findora Logo" className="h-full w-full rounded-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold">Findora</h3>
            </div>

            <div className="h-48 w-48 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white shadow-lg " >
              <img src={logo} alt="Data security illustration" className="h-full w-full rounded-xl object-cover" />
            </div>

            <div className="max-w-sm text-center">
              
              <p className="mt-2 text-sm text-slate-600">Access your account to manage reports, connect with the community and recover what matters most.</p>
            </div>
          </div>

          <div className="p-8 bg-white/20 backdrop-blur-xl border-l border-white/30" style={{animationDelay: '0.14s'}}>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">NIC Number</label>
                <input
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="Enter NIC No"
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-4 py-2 text-sm outline-none"
                  style={{animationDelay: '0.18s'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-2 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-4 py-2 text-sm outline-none"
                    style={{animationDelay: '0.20s'}}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-sm text-slate-500">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="h-4 w-4" />
                  Remember me
                </label>
                <Link to="#" className="text-sm text-blue-600">Forgot password?</Link>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
                style={{animationDelay: '0.24s'}}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>


              <p className="text-center text-sm text-slate-500">Don't have an account? <Link to="/choose-role" className="text-blue-600">Sign up now</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;