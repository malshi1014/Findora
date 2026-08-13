import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { User, Store, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function ChooseRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = {
    user: {
      title: "Normal User",
      desc: "Report lost and found items, search posts, help others, and connect with the community.",
      icon: <User className="w-8 h-8" />,
      features: ["Report lost items", "Claim found items", "Community rewards"],
    },
    shop: {
      title: "Shop Owner",
      desc: "Register your business and help connect users with found items and recovery support.",
      icon: <Store className="w-8 h-8" />,
      features: ["Report suspicious items", "Store verification badge", "Admin priority support"],
    },
  };

  const handleContinue = () => {
    if (selectedRole === "shop") {
      navigate(`/shop-register`);
    } else if (selectedRole === "user") {
      navigate(`/register`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Join Findora Today
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Choose how you want to use the platform. You can always change your account settings later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {Object.entries(roles).map(([key, role], index) => {
              const isSelected = selectedRole === key;
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedRole(key)}
                  className={`relative group cursor-pointer rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 bg-white
                    ${isSelected 
                      ? "border-blue-600 shadow-lg shadow-blue-900/5" 
                      : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                >
                  <div className={`inline-flex p-4 rounded-xl mb-6 transition-colors duration-300
                    ${isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"}
                  `}>
                    {role.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed min-h-[60px]">{role.desc}</p>

                  <ul className="space-y-3 mb-8">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300
                    ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}
                  `}>
                    {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`flex items-center justify-center gap-2 w-full max-w-sm rounded-full px-8 py-4 text-base font-semibold text-white shadow-sm transition-all duration-300
                ${selectedRole 
                  ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5" 
                  : "bg-slate-300 cursor-not-allowed opacity-70"
                }`}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChooseRole;
