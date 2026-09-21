import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, CheckCircle, ShieldAlert, User, PawPrint } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("findora_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const handleReportClick = (link, allowedRoles = null) => {
    const user = getCurrentUser();

    if (!user) {
      navigate("/login", {
        state: {
          from: link,
          requiredRole: allowedRoles ? "shop_owner" : null,
          message: allowedRoles
            ? "Please sign in with shop owner credentials to report a suspicious item."
            : "Please sign in to continue to the report form.",
        },
      });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate("/login", {
        state: {
          from: link,
          requiredRole: "shop_owner",
          message:
            "Suspicious item reports are restricted to shop owners. Please sign in with shop owner credentials.",
        },
      });
      return;
    }

    navigate(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-white px-6 py-24 flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70"></div>
      <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl animate-pulse-soft"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 mb-8">
            <span className="text-[13px] font-semibold uppercase tracking-widest text-blue-600">
              Trusted Recovery Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Reuniting What Matters, <br className="hidden md:block" />
            <span className="text-blue-600">Restoring Peace of Mind.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-600"
          >
            We help bring lost items, missing pets and missing persons back to
            their families with fast recovery tools, intelligent matching and
            trusted community support.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto"
          >
            {/* Report Lost Item */}
            <button
              type="button"
              onClick={() => handleReportClick("/report-lost")}
              className="group relative flex w-full sm:w-[150px] md:w-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/60 bg-white/80 px-4 py-6 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex rounded-full bg-blue-100 p-3.5 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Search size={24} strokeWidth={2.5} />
              </div>
              <span className="text-center leading-tight">Lost<br />Item</span>
            </button>

            {/* Report Found Item */}
            <button
              type="button"
              onClick={() => handleReportClick("/report-found")}
              className="group relative flex w-full sm:w-[150px] md:w-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/60 bg-white/80 px-4 py-6 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex rounded-full bg-emerald-100 p-3.5 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <CheckCircle size={24} strokeWidth={2.5} />
              </div>
              <span className="text-center leading-tight">Found<br />Item</span>
            </button>

            {/* Report Suspicious Item */}
            <button
              type="button"
              onClick={() => handleReportClick("/report-suspicious", ["shop_owner", "admin"])}
              className="group relative flex w-full sm:w-[150px] md:w-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/60 bg-white/80 px-4 py-6 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="flex rounded-full bg-amber-100 p-3.5 text-amber-600 transition-colors duration-300 group-hover:bg-amber-600 group-hover:text-white">
                <ShieldAlert size={24} strokeWidth={2.5} />
              </div>
              <span className="text-center leading-tight">Suspicious<br />Item</span>
            </button>

            {/* Report Missing Person */}
            <button
              type="button"
              onClick={() => handleReportClick("/report-person")}
              className="group relative flex w-full sm:w-[150px] md:w-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/60 bg-white/80 px-4 py-6 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="flex rounded-full bg-purple-100 p-3.5 text-purple-600 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
                <User size={24} strokeWidth={2.5} />
              </div>
              <span className="text-center leading-tight">Missing<br />Person</span>
            </button>

            {/* Report Missing Pet */}
            <button
              type="button"
              onClick={() => handleReportClick("/report-pet")}
              className="group relative flex w-full sm:w-[150px] md:w-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/60 bg-white/80 px-4 py-6 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-300 hover:bg-rose-50/50 hover:shadow-xl hover:shadow-rose-500/10"
            >
              <div className="flex rounded-full bg-rose-100 p-3.5 text-rose-600 transition-colors duration-300 group-hover:bg-rose-600 group-hover:text-white">
                <PawPrint size={24} strokeWidth={2.5} />
              </div>
              <span className="text-center leading-tight">Missing<br />Pet</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
