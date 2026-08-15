import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
              🚀 Live CI/CD Recovery Platform
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Reuniting What Matters, <br className="hidden md:block"/>
            <span className="text-blue-600">Restoring Peace of Mind.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-600"
          >
            We help bring lost items, missing pets, and missing persons back to
            their families with fast recovery tools, intelligent matching, and
            trusted community support.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => handleReportClick("/report-lost")}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-[15px] font-medium text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
            >
              Report Lost Item
            </button>

            <button
              type="button"
              onClick={() => handleReportClick("/report-found")}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-[15px] font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
            >
              Report Found Item
            </button>

            <button
              type="button"
              onClick={() => handleReportClick("/report-suspicious", ["shop_owner", "admin"])}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-[15px] font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
            >
              Report Suspicious Item
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
