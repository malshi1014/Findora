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
      <div className="min-h-screen" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, white 0%, #E1EAFE 100%)" }}>
        <div className="w-full max-w-[2160px] mx-auto p-6 sm:p-10 flex flex-col gap-6 sm:gap-8">

          {/* Header */}
          <div>
            <span className="inline-block px-4 sm:px-[18px] py-1 sm:py-[6px] bg-[rgba(0,88,188,0.10)] rounded-full text-[#0058BC] text-xs sm:text-base font-semibold font-[Inter] tracking-[0.83px]">
              MATCH OVERVIEW
            </span>
            <h1 className="text-[#1B1B1D] text-3xl sm:text-[48px] font-bold font-[Inter] leading-tight sm:leading-[60px] pt-3">
              Your Matches
            </h1>
            <p className="text-[#717786] text-base sm:text-xl font-normal font-[Inter] leading-snug sm:leading-[30px] max-w-[600px]">
              Review and manage potential matches for your lost and found reports.
            </p>
          </div>

          {/* Match Cards */}
          <div className="flex flex-col gap-5">
            {matchData.map((match) => (
              <Link
                key={match.id}
                to="/possible-match"
                className="group p-6 sm:p-8 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 hover:shadow-[0_45px_75px_rgba(0,88,188,0.08)] hover:border-[rgba(0,88,188,0.20)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                  {/* Left: Confidence + Info */}
                  <div className="flex items-center gap-5 sm:gap-6">
                    {/* Confidence Circle */}
                    <div className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#EAE7EA" strokeWidth="6" />
                        <circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke={match.confidence >= 80 ? "#22C55E" : match.confidence >= 60 ? "#EAB308" : "#EF4444"}
                          strokeWidth="6"
                          strokeDasharray={`${(match.confidence / 100) * 213.6} 213.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[#1B1B1D] text-lg sm:text-xl font-bold font-[Inter]">
                        {match.confidence}%
                      </span>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="text-[#1B1B1D] text-lg sm:text-2xl font-bold font-[Inter] leading-snug sm:leading-[36px]">
                        {match.title}
                      </h3>
                      <p className="text-[#717786] text-sm sm:text-lg font-medium font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px]">
                        Matched with: <span className="text-[#0058BC]">{match.foundTitle}</span>
                      </p>
                      <p className="text-[#9CA3AF] text-xs sm:text-sm font-normal font-[Inter] mt-0.5">
                        {match.location} &middot; {match.date}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status + Arrow */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold font-[Inter] tracking-[0.36px] ${
                      match.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-50 text-orange-600"
                    }`}>
                      {match.status}
                    </span>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[rgba(0,88,188,0.08)] flex items-center justify-center group-hover:bg-[rgba(0,88,188,0.15)] transition">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </DashboardLayout>
  );
}

export default Matches;
