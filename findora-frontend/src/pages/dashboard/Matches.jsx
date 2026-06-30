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
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #7ec0fc 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <h1 className="text-3xl font-bold text-slate-950">Your Matches</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Review and manage potential matches for your lost and found reports.</p>
            </div>

            <div className="space-y-4">
              {matchData.map((match) => (
                <Link
                  key={match.id}
                  to="/possible-match"
                  className="block p-5 sm:p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 hover:bg-white/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="relative w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] shrink-0">
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
                        <span className="absolute inset-0 flex items-center justify-center text-slate-900 text-base sm:text-lg font-bold">
                          {match.confidence}%
                        </span>
                      </div>

                      <div>
                        <h3 className="text-slate-900 text-base sm:text-xl font-bold leading-snug">{match.title}</h3>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-snug mt-0.5">
                          Matched: <span className="text-blue-600">{match.foundTitle}</span>
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {match.location} &middot; {match.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold ${
                        match.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-orange-50 text-orange-600"
                      }`}>
                        {match.status}
                      </span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
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
