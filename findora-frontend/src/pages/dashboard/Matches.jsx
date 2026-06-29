import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const matchData = [
  {
    id: 1,
    title: "Sony WH-1000XM4 Headphones",
    foundTitle: "Black Sony Headphones",
    confidence: 92,
    status: "Pending",
    date: "Oct 25, 2023",
    location: "Central Park Cafe, Downtown",
  },
  {
    id: 2,
    title: "Brown Leather Wallet",
    foundTitle: "Leather Bifold Wallet",
    confidence: 78,
    status: "Pending",
    date: "Oct 22, 2023",
    location: "Main Street Station",
  },
  {
    id: 3,
    title: "Silver Samsung Galaxy Watch",
    foundTitle: "Samsung Smartwatch",
    confidence: 85,
    status: "Confirmed",
    date: "Oct 18, 2023",
    location: "Riverside Mall",
  },
];

function Matches() {
  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">Match Overview</span>
                  <h1 className="mt-4 text-3xl font-bold text-slate-950">Your Matches</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Review and manage potential matches for your lost and found reports.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/40 backdrop-blur px-4 py-3 shadow-sm shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white text-lg font-bold">D</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                    <p className="text-sm text-slate-500">Matches</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {matchData.map((match) => (
                <Link
                  key={match.id}
                  to="/possible-match"
                  className="block p-6 sm:p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:bg-white/40 hover:border-blue-300/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                          <circle
                            cx="40" cy="40" r="34" fill="none"
                            stroke={match.confidence >= 80 ? "#22C55E" : match.confidence >= 60 ? "#EAB308" : "#EF4444"}
                            strokeWidth="6"
                            strokeDasharray={`${(match.confidence / 100) * 213.6} 213.6`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-slate-900 text-lg sm:text-xl font-bold">
                          {match.confidence}%
                        </span>
                      </div>

                      <div>
                        <h3 className="text-slate-900 text-lg sm:text-2xl font-bold leading-snug">{match.title}</h3>
                        <p className="text-slate-500 text-sm sm:text-lg font-medium leading-snug">
                          Matched with: <span className="text-blue-600">{match.foundTitle}</span>
                        </p>
                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                          {match.location} &middot; {match.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        match.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-50 text-orange-600"
                      }`}>
                        {match.status}
                      </span>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="#0058BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Matches;
