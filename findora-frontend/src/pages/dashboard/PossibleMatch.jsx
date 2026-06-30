import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function PossibleMatch() {
  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

      <Navbar hideAuth />

      <div className="relative z-10 flex items-start justify-center p-6 sm:p-8">
        <div className="w-full max-w-5xl mx-auto">

          <Link to="/matches" className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-blue-600 transition mb-6">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 7H3M7 3L3 7L7 11" />
            </svg>
            Back to Matches
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-950">Possible Match Found</h1>
              <p className="text-slate-500 text-lg mt-1">Review the details below to confirm if this is your reported item.</p>
            </div>

            <div className="w-full lg:w-auto px-6 py-5 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex items-center gap-6 shrink-0">
              <div className="text-center">
                <span className="text-blue-600 text-4xl font-bold">92</span>
                <span className="text-blue-600 text-lg font-bold">%</span>
              </div>
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-[1px]">High Confidence</p>
                <p className="text-slate-500 text-sm">Based on 5 matching attributes</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex items-center gap-3 pb-5 border-b border-white/30">
                <div className="w-2 h-8 bg-blue-600 rounded" />
                <h2 className="text-2xl font-semibold text-slate-900">Your Report</h2>
                <div className="flex-1 text-right">
                  <span className="inline-block px-3 py-1 bg-white/40 rounded-full text-slate-500 text-xs font-semibold">Lost: Oct 24, 2023</span>
                </div>
              </div>
              <div className="mt-6 h-60 bg-white/20 rounded-xl flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#CBD5E1"/>
                  <path d="M4 20L10 12L14 16L18 8L22 14V20H4Z" fill="#94A3B8"/>
                  <circle cx="8" cy="8" r="2" fill="#94A3B8"/>
                </svg>
              </div>
              <div className="mt-6 space-y-5">
                <ReportField label="Title" value="Sony WH-1000XM4 Headphones" />
                <ReportField label="Category" value="Electronics > Audio" />
                <ReportField label="Location" value="Central Park Cafe, Downtown" />
                <ReportField label="Description" value="Black noise-canceling headphones in a black carrying case. There's a small scratch on the right earcup. Last seen near the counter." />
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] shadow-xl shadow-blue-600/20 relative overflow-hidden">
              <div className="absolute w-80 h-80 -right-20 -top-20 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 pb-5 border-b border-white/20 relative z-10">
                <div className="w-2 h-8 bg-yellow-400 rounded" />
                <h2 className="text-2xl font-semibold text-white">Matching Report</h2>
                <div className="flex-1 text-right">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold">Reported: Oct 25, 2023</span>
                </div>
              </div>
              <div className="mt-6 h-60 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center relative z-10">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="rgba(255,255,255,0.15)"/>
                  <path d="M4 20L10 12L14 16L18 8L22 14V20H4Z" fill="rgba(255,255,255,0.3)"/>
                  <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.3)"/>
                </svg>
              </div>
              <div className="mt-6 space-y-5 relative z-10">
                <FoundField label="Title" value="Black Sony Headphones" />
                <FoundField label="Category" value="Electronics > Audio" />
                <FoundField label="Location" value="Downtown Transit Hub (Near Cafe)" />
                <FoundField label="Description" value="Found these in a case on a bench outside the cafe area. Looks like there's a minor scuff mark on the side. Handed to transit security." />
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-4 relative z-10">
                <button className="flex-1 h-14 bg-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 hover:scale-[1.03] active:scale-95 transition-all duration-200 text-sm font-semibold text-blue-600 shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                  Accept
                </button>
                <button className="flex-1 h-14 bg-white/10 rounded-xl border border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 hover:scale-[1.03] active:scale-95 transition-all duration-200 text-sm font-semibold text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor"/></svg>
                  Contact Finder
                </button>
                <button className="flex-1 h-14 bg-red-500/20 rounded-xl border border-red-300/40 flex items-center justify-center gap-2 hover:bg-red-500/40 hover:border-red-300/60 hover:scale-[1.03] active:scale-95 transition-all duration-200 text-sm font-semibold text-red-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6L18 18"/></svg>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportField({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm font-semibold">{label}</p>
      <p className="text-slate-900 text-lg font-medium">{value}</p>
    </div>
  );
}

function FoundField({ label, value }) {
  return (
    <div>
      <p className="text-white/80 text-sm font-semibold">{label}</p>
      <p className="text-white text-lg font-medium">{value}</p>
    </div>
  );
}

export default PossibleMatch;
