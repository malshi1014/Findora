import { useNavigate } from "react-router-dom";

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

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-blue-600 to-blue-100 px-6 py-16">
      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <div className="items-center">
          <div className="h-full min-h-[620px] justify-items-center rounded-3xl border border-white/40 bg-white/25 px-20 pb-10 pt-20 shadow-xl backdrop-blur-xl animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
              Trusted recovery platform
            </p>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950">
              Reuniting What Matters, Restoring Peace of Mind
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-800">
              We help bring lost items, missing pets and missing persons back to
              their families with fast recovery tools, intelligent matching and
              trusted community support.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => handleReportClick("/report-lost")}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Report Lost Item
              </button>

              <button
                type="button"
                onClick={() => handleReportClick("/report-found")}
                className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-white/70 px-8 py-3 text-sm font-semibold text-blue-600 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Report Found Item
              </button>

              <button
                type="button"
                onClick={() =>
                  handleReportClick("/report-suspicious", [
                    "shop_owner",
                    "admin",
                  ])
                }
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-black/10 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-1 hover:bg-slate-100"
              >
                Report Suspicious Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
