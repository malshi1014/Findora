import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import logo from "../../assets/logo/registration.svg";
import { UserPlus, ArrowRight, ShieldCheck, Mail, Phone, Lock, Hash } from "lucide-react";
import { motion } from "framer-motion";
import TownSelect from "../../components/TownSelect";
import { SRI_LANKA_DISTRICTS } from "../../data/sriLankaDistricts";

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(""); // nearest_town
  const [district, setDistrict] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // First Name
    const fName = firstName.trim();
    if (!fName) {
      newErrors.firstName = "First name is required.";
    } else if (fName.length < 2 || fName.length > 50) {
      newErrors.firstName = "First name must be between 2 and 50 characters.";
    } else if (!/^[a-zA-Z\s\-']+$/.test(fName)) {
      newErrors.firstName = "First name can only contain letters, spaces, hyphens, and apostrophes.";
    }

    // Last Name
    const lName = lastName.trim();
    if (!lName) {
      newErrors.lastName = "Last name is required.";
    } else if (lName.length < 2 || lName.length > 50) {
      newErrors.lastName = "Last name must be between 2 and 50 characters.";
    } else if (!/^[a-zA-Z\s\-']+$/.test(lName)) {
      newErrors.lastName = "Last name can only contain letters, spaces, hyphens, and apostrophes.";
    }

    // Email
    const emailVal = email.trim().toLowerCase();
    if (!emailVal) {
      newErrors.email = "Email is required.";
    } else if (emailVal.length > 254) {
      newErrors.email = "Email must be less than 255 characters.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // NIC
    const nicVal = nic.trim().toUpperCase();
    if (!nicVal) {
      newErrors.nic = "NIC is required.";
    } else if (!/^([0-9]{9}[VX]|[0-9]{12})$/.test(nicVal)) {
      newErrors.nic = "Please enter a valid Sri Lankan NIC (e.g., 123456789V or 200012345678).";
    }

    // Phone
    const phoneVal = phone.trim();
    if (!phoneVal) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^07[0-9]{8}$/.test(phoneVal)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number starting with 07.";
    }

    // Nearest Town
    if (!city || city.trim() === "") {
      newErrors.city = "Nearest town is required.";
    }

    // District
    if (!district || district === "") {
      newErrors.district = "Please select a district.";
    } else if (!SRI_LANKA_DISTRICTS.includes(district)) {
      newErrors.district = "Invalid district selected.";
    }

    // Password
    const pwd = password.trim();
    if (!pwd) {
      newErrors.password = "Password is required.";
    } else if (pwd.length < 8 || pwd.length > 72) {
      newErrors.password = "Password must be between 8 and 72 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(pwd)) {
      newErrors.password = "Password must contain at least one uppercase, lowercase, number, and special character.";
    }

    // Confirm Password
    if (!confirm) {
      newErrors.confirm = "Please confirm your password.";
    } else if (pwd !== confirm.trim()) {
      newErrors.confirm = "Passwords do not match.";
    }

    // Agree
    if (!agree) {
      newErrors.agree = "You must agree to the Terms of Service and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    
    if (!validateForm()) {
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
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          nic: nic.trim().toUpperCase(),
          mobile: phone.trim(),
          district: district,
          nearest_town: city.trim(),
          password: password.trim(),
        }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.status === "success") {
        alert("Account created successfully! Please login.");
        navigate("/login");
      } else {
        setServerError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setServerError("Backend connection failed. Please check your connection.");
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
              noValidate
            >
              {serverError && (
                <motion.div variants={itemVariants} className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 text-xs flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">⚠️</div>
                  <p>{serverError}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); if(errors.firstName) setErrors({...errors, firstName: null}); }}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${errors.firstName ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); if(errors.lastName) setErrors({...errors, lastName: null}); }}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${errors.lastName ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                    onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.email ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                      onChange={(e) => { setNic(e.target.value); if(errors.nic) setErrors({...errors, nic: null}); }}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.nic ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white uppercase`}
                    />
                  </div>
                  {errors.nic && <p className="text-red-500 text-xs mt-1">{errors.nic}</p>}
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="07X XXX XXXX"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if(errors.phone) setErrors({...errors, phone: null}); }}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.phone ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Nearest Town</label>
                  <TownSelect 
                    value={city}
                    onChange={(val) => { setCity(val); if(errors.city) setErrors({...errors, city: null}); }}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">District</label>
                  <select
                    value={district}
                    onChange={(e) => { setDistrict(e.target.value); if(errors.district) setErrors({...errors, district: null}); }}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${errors.district ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white appearance-none`}
                  >
                    <option value="" disabled>Select District</option>
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
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
                      onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.password ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white`}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.password}</p>}
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); if(errors.confirm) setErrors({...errors, confirm: null}); }}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.confirm ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} focus:ring-4 outline-none transition-all bg-slate-50/50 hover:bg-white`}
                    />
                  </div>
                  {errors.confirm && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.confirm}</p>}
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={() => { setAgree(!agree); if(errors.agree) setErrors({...errors, agree: null}); }}
                      className={`peer w-4 h-4 appearance-none rounded border-2 ${errors.agree ? 'border-red-500' : 'border-slate-300'} checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer`}
                    />
                    <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I have read and agree to the{" "}
                      <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">Privacy Policy</Link>
                      .
                    </span>
                    {errors.agree && <span className="text-red-500 text-xs mt-1">{errors.agree}</span>}
                  </div>
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
