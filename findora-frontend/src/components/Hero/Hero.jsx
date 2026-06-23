import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-blue-600 to-blue-100 px-6 py-16">
      
      {/* Animated background circles */}
     
      
      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <div className="items-center">
          
          <div className="px-20 pt-40 h-full min-h-[620px] rounded-3xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-xl  pt-20 pb-10 px-20 justify-items-center animate-fade-up">
            
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
              Trusted recovery platform
            </p>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 ">
              Reuniting What Matters, Restoring Peace of Mind
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-800">
              We help bring lost items, missing pets and missing persons back to their
              families with fast recovery tools, intelligent matching and trusted
              community support.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Report Lost Item
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-white/70 px-8 py-3 text-sm font-semibold text-blue-600 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Report Found Item
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-black/10 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-1 hover:bg-slate-100"
              >
                Report Suspicious Item
              </Link>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}

export default Hero;