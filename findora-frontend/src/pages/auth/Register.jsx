import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import logo from "../../assets/logo/registration.svg";
import { UserPlus, ArrowRight, ShieldCheck, Mail, MapPin, Phone, Lock, Hash } from "lucide-react";
import { motion } from "framer-motion";
import TownSelect from "../../components/TownSelect";

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

    if (!firstName || !lastName || !email || !nic || !phone || !city || !address || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          nic: nic,
          mobile: phone,
          district: address,
          nearest_town: city,
          password: password,
        }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.status === "success") {
        alert("Account created successfully! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Backend connection failed. Please check your connection.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 mix-blend-multiply blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 mix-blend-multiply blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-200/40 mix-blend-multiply blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row overflow-hidden relative z-10 border border-slate-100"
      >
        {/* Left Side - Brand & Illustration */}
        <div className="lg:w-5/12 bg-blue-600 p-6 flex flex-col justify-between text-white relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
          {/* Decorative Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 w-fit hover:opacity-90 transition-opacity">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <img src="/favicon.png" alt="Findora" className="h-5 w-5 object-contain" />
              </div>
              <span className="text-lg font-bold tracking-tight">Findora</span>
            </Link>

            <div className="mt-10">
              <h2 className="text-2xl font-bold leading-tight mb-3">
                Join our community<br/>of finders.
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
                Create an account to report lost items, help others recover their valuables, and become part of a reliable network.
              </p>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-blue-100 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                <span>Secure & Verified Community</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100 text-xs">
                <UserPlus className="w-4 h-4 text-blue-300" />
                <span>Easy Registration Process</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
            <img src={logo} alt="register illustration" className="w-full h-auto drop-shadow-2xl opacity-90" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Create your account</h3>
              <p className="text-sm text-slate-500">Get started by filling out the details below.</p>
            </div>

            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              {error && (
                <motion.div variants={itemVariants} className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 text-xs flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">⚠️</div>
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">NIC Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter NIC"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                    />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="07X XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                    />
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Nearest Town</label>
                  <TownSelect 
                    value={city}
                    onChange={setCity}
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Western"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                    />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 hover:bg-white"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={() => setAgree(!agree)}
                      className="peer w-4 h-4 appearance-none rounded border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I have read and agree to the{" "}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">Privacy Policy</Link>
                    .
                  </span>
                </label>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                    Log in here
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
