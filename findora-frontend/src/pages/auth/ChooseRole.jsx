import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function ChooseRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = {
    user: {
      title: "Normal User",
      desc: "Report lost and found items, search posts, help others, receive rewards, and connect with the community.",
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-9 sm:h-9">
          <circle cx="24" cy="14" r="8" stroke="#3B82F6" strokeWidth="3" />
          <path d="M8 42C8 33.1634 15.1634 26 24 26C32.8366 26 40 33.1634 40 42" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    shop: {
      title: "Shop Owner",
      desc: "Register your business and help connect users with found items and recovery support.",
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-9 sm:h-9">
          <path d="M6 14L10 6H38L42 14" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="14" width="32" height="28" rx="2" stroke="#8B5CF6" strokeWidth="3" />
          <path d="M18 14V22H30V14" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 28H30" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 34H26" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
  };

  const selectedStyles = {
    user: {
      card: "bg-blue-100 border-blue-400 ring-2 ring-blue-400",
      icon: "bg-blue-200",
      btn: "bg-blue-500",
    },
    shop: {
      card: "bg-purple-100 border-purple-400 ring-2 ring-purple-400",
      icon: "bg-purple-200",
      btn: "bg-purple-600",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-200 to-blue-500 flex flex-col font-[Outfit]">
      <Navbar hideAuth />

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute -left-40 -top-52 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-blue-400/20 blur-[100px] sm:blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] rounded-full bg-purple-400/20 blur-[100px] sm:blur-[120px]" />
        <div className="absolute left-1/3 top-1/3 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-indigo-300/10 blur-[80px] sm:blur-[100px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 sm:pt-16 pb-6 flex flex-col items-center gap-6 sm:gap-10 h-full justify-center">
          <div className="flex flex-col items-center gap-1 sm:gap-2 max-w-[520px]">
            <h1 className="text-[#0F1523] text-2xl sm:text-[40px] font-bold leading-tight sm:leading-[55px] text-center">
              Create Your Account
            </h1>
            <p className="text-[#6B7A9F] text-sm sm:text-2xl font-normal leading-snug sm:leading-[34px] text-center">
              Choose how you want to join Findora.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-[900px]">
            {Object.entries(roles).map(([key, role]) => {
              const isSelected = selectedRole === key;
              const sel = selectedStyles[key];
              return (
                <div
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  className={`flex-1 backdrop-blur rounded-2xl sm:rounded-[20px] border p-4 sm:p-7 flex flex-col justify-center gap-3 sm:gap-5 cursor-pointer transition-all duration-300
                    ${isSelected ? `${sel.card} scale-[1.02] shadow-xl` : "bg-white/70 border-white/60 hover:scale-[1.02] hover:shadow-lg hover:bg-gray-50"}`}
                >
                  <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[24px] flex items-center justify-center transition-all duration-300 ${isSelected ? sel.icon : "bg-gray-100"}`}>
                    {role.icon}
                  </div>
                  <div>
                    <h2 className="text-[#0F1523] text-base sm:text-2xl font-semibold leading-snug sm:leading-[32px]">
                      {role.title}
                    </h2>
                    <p className="text-[#6B7A9F] text-xs sm:text-base font-medium leading-relaxed sm:leading-[24px] max-w-[400px] pt-1">
                      {role.desc}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/register?role=${key}`); }}
                    className={`w-full px-4 sm:px-6 py-2 sm:py-3.5 rounded-full sm:rounded-[26px] flex items-center justify-center gap-2 sm:gap-3 text-white text-xs sm:text-base font-semibold transition-all duration-300
                      ${isSelected ? `${sel.btn} hover:opacity-90` : "bg-blue-400 hover:bg-blue-500"}`}
                  >
                    Continue as {role.title === "Normal User" ? "User" : "Shop Owner"}
                    <svg width="18" height="18" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-5 sm:h-5">
                      <path d="M13.34 5.56L21.12 13.34L13.34 21.12" stroke="white" strokeWidth="2.45" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.56 13.34H21.12" stroke="white" strokeWidth="2.45" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-1 sm:gap-1.5">
            <p className="text-[#6B7A9F] text-xs sm:text-base font-normal text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-[#155DFC] text-sm sm:text-lg font-semibold hover:underline">
                Login
              </Link>
            </p>
            <p className="text-[rgba(38, 43, 56, 0.6)] text-[10px] sm:text-sm font-normal text-center">
              You can change certain account settings later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseRole;
