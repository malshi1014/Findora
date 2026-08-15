import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import logo from "../../assets/logo/registration.svg";
import TownSelect from "../../components/TownSelect";
import { SRI_LANKA_DISTRICTS } from "../../data/sriLankaDistricts";

function ShopRegister() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(""); // nearest_town
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState(""); // shop_address
  const [shopName, setShopName] = useState("");
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

    // Shop Name & Address
    if (!shopName.trim()) {
      newErrors.shopName = "Shop name is required.";
    }
    if (!address.trim()) {
      newErrors.address = "Shop address is required.";
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
      const response = await fetch(`${API_BASE_URL}/auth/shopregister.php`, {
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
          shop_name: shopName.trim(),
          shop_address: address.trim(),
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

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-300 via-blue-100 to-blue-300 flex items-center justify-center p-6">
      <div
        className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-[radial-gradient(circle_at_center,rgba(186,230,253,0.85)_0%,rgba(96,165,250,0.65)_45%,rgba(30,64,175,0.95)_100%)] backdrop-blur-2xl shadow-2xl shadow-blue-900/20 animate-fade-up"
        style={{ animationDelay: "0.04s" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side */}
          <div
            className="p-10 flex flex-col gap-6 items-start justify-center animate-fade-up"
            style={{ animationDelay: "0.08s" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center">
                <img
                  src="/favicon.png"
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
                Create an account to report lost items, help others recover
                their valuables and become part of a reliable network dedicated
                to restoring peace of mind.
              </p>
            </div>

            <div className="mt-4 ml-10 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-4 shadow-xl">
              <img
                src={logo}
                alt="register"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="p-8 bg-white/20 backdrop-blur-xl border-l border-white/30">
            <div
              className="max-w-md mx-auto animate-fade-up"
              style={{ animationDelay: "0.12s" }}
            >
              <h3 className="text-xl font-semibold text-slate-950">
                Create Shop Account
              </h3>
              <p className="text-sm text-slate-800">
                Get started by filling out the details below.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {serverError && (
                  <div className="rounded-2xl bg-red-50/80 p-3 text-sm text-red-600 border border-red-200">
                    {serverError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if(errors.firstName) setErrors({...errors, firstName: null}); }}
                      className={`w-full rounded-2xl border ${errors.firstName ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                      style={{ animationDelay: "0.16s" }}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if(errors.lastName) setErrors({...errors, lastName: null}); }}
                      className={`w-full rounded-2xl border ${errors.lastName ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                      style={{ animationDelay: "0.18s" }}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <input
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                    className={`w-full rounded-2xl border ${errors.email ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                    style={{ animationDelay: "0.20s" }}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      placeholder="NIC"
                      value={nic}
                      onChange={(e) => { setNic(e.target.value); if(errors.nic) setErrors({...errors, nic: null}); }}
                      className={`w-full rounded-2xl border ${errors.nic ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up uppercase`}
                      style={{ animationDelay: "0.22s" }}
                    />
                    {errors.nic && <p className="text-red-500 text-xs mt-1">{errors.nic}</p>}
                  </div>

                  <div>
                    <input
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if(errors.phone) setErrors({...errors, phone: null}); }}
                      className={`w-full rounded-2xl border ${errors.phone ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                      style={{ animationDelay: "0.24s" }}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <input
                    placeholder="Shop Name"
                    value={shopName}
                    onChange={(e) => { setShopName(e.target.value); if(errors.shopName) setErrors({...errors, shopName: null}); }}
                    className={`w-full rounded-2xl border ${errors.shopName ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                    style={{ animationDelay: "0.26s" }}
                  />
                  {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 animate-fade-up" style={{ animationDelay: "0.26s" }}>
                      <TownSelect 
                        value={city}
                        onChange={(val) => { setCity(val); if(errors.city) setErrors({...errors, city: null}); }}
                        placeholder="Nearest Town"
                        hasIcon={false}
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <select
                      value={district}
                      onChange={(e) => { setDistrict(e.target.value); if(errors.district) setErrors({...errors, district: null}); }}
                      className={`w-full rounded-2xl border ${errors.district ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up appearance-none`}
                      style={{ animationDelay: "0.27s" }}
                    >
                      <option value="" disabled>Select District</option>
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                  </div>
                </div>

                <div>
                  <input
                    placeholder="Shop Address"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); if(errors.address) setErrors({...errors, address: null}); }}
                    className={`w-full rounded-2xl border ${errors.address ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                    style={{ animationDelay: "0.28s" }}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                      className={`w-full rounded-2xl border ${errors.password ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                      style={{ animationDelay: "0.30s" }}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.password}</p>}
                  </div>
                  <div>
                    <input
                      placeholder="Confirm Password"
                      type="password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); if(errors.confirm) setErrors({...errors, confirm: null}); }}
                      className={`w-full rounded-2xl border ${errors.confirm ? 'border-red-400' : 'border-white/40 focus:border-blue-400'} bg-white/50 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 animate-fade-up`}
                      style={{ animationDelay: "0.32s" }}
                    />
                    {errors.confirm && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.confirm}</p>}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={() => { setAgree(!agree); if(errors.agree) setErrors({...errors, agree: null}); }}
                      className={`h-4 w-4 rounded ${errors.agree ? 'border-red-500 outline-red-500' : ''}`}
                    />
                    I have read and agree to the{" "}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                  {errors.agree && <p className="text-red-500 text-xs mt-1">{errors.agree}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-up"
                  style={{ animationDelay: "0.36s" }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-700 font-medium hover:underline">
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

export default ShopRegister;