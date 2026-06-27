import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function PossibleMatch() {
  return (
    <div className="min-h-screen relative" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, #7890FF 0%, white 100%)" }}>

      <Navbar hideAuth />

      <div className="flex items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-[1920px] mx-auto">

        {/* Back to Matches */}
        <Link to="/matches" className="inline-flex items-center gap-3 text-[#64748B] text-xl font-medium font-['Inter'] leading-[25.2px] tracking-[1.05px] hover:text-blue-600 transition mb-8">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 6H3.41L8.71 0.71L7.29 -0.71L-0.71 7.29L7.29 15.29L8.71 13.88L3.41 8.59H14V6Z" fill="#64748B"/>
          </svg>
          Back to Matches
        </Link>

        {/* Header + Confidence Card */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-10">
          <div className="max-w-[814px]">
            <h1 className="text-[#1A253C] text-5xl xl:text-[72px] font-bold font-['Sora'] leading-tight xl:leading-[86.4px]">
              Possible Match Found
            </h1>
            <p className="text-[#64748B] text-xl xl:text-2xl font-normal font-['Inter'] leading-[38.4px] mt-1">
              Review the details below to confirm if this is your reported item.
            </p>
          </div>

          <div className="w-full xl:w-auto px-6 py-6 bg-[rgba(255,255,255,0.70)] backdrop-blur-[15px] rounded-[18px] border border-[rgba(29,97,231,0.20)] shadow-[0_6px_30px_rgba(29,97,231,0.05)] flex items-center gap-9 shrink-0">
            <div className="text-center">
              <span className="text-[#1D61E7] text-4xl font-bold font-['Sora'] leading-[50.4px]">92</span>
              <span className="text-[#1D61E7] text-[21px] font-bold font-['Sora'] leading-[30px]">%</span>
            </div>
            <div>
              <p className="text-[#1D61E7] text-xl font-medium font-['Inter'] uppercase leading-[25.2px] tracking-[1.05px]">HIGH CONFIDENCE</p>
              <p className="text-[#64748B] text-xl font-normal font-['Inter'] leading-[30px]">Based on 5 matching attributes</p>
            </div>
          </div>
        </div>

        {/* Two-Column Comparison */}
        <div className="flex flex-col xl:flex-row gap-[43px]">

          {/* Your Report */}
          <div className="flex-1 p-8 bg-[rgba(255,255,255,0.70)] backdrop-blur-[13.48px] rounded-[16.17px] border border-[rgba(255,255,255,0.90)] shadow-[0_5.39px_26.95px_rgba(29,97,231,0.05)]">
            <div className="flex items-center gap-4 pb-5 border-b border-[#EEF2FF]">
              <div className="w-6 h-[27px] bg-[#1D61E7] rounded" />
              <h2 className="text-[#1A253C] text-[32px] font-semibold font-['Sora'] leading-[45.28px]">Your Report</h2>
              <div className="flex-1 text-right">
                <span className="inline-block px-4 py-1 bg-[#EEF2FF] rounded-full text-[#64748B] text-base font-semibold font-['Inter'] leading-[19.41px]">Lost: Oct 24, 2023</span>
              </div>
            </div>
            <div className="mt-[26px] h-[259px] bg-[#F1F5F9] rounded-[10.78px] overflow-hidden flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#CBD5E1"/>
                <path d="M4 20L10 12L14 16L18 8L22 14V20H4Z" fill="#94A3B8"/>
                <circle cx="8" cy="8" r="2" fill="#94A3B8"/>
              </svg>
            </div>
            <div className="mt-7 space-y-5">
              <ReportField label="Title" value="Sony WH-1000XM4 Headphones" />
              <ReportField label="Category" value="Electronics > Audio" />
              <ReportField label="Location" value="Central Park Cafe, Downtown" />
              <ReportField label="Description" value="Black noise-canceling headphones in a black carrying case. There's a small scratch on the right earcup. Last seen near the counter." description />
            </div>
          </div>

          {/* Found Item */}
          <div className="flex-1 p-8 bg-[#7BA4FF] backdrop-blur-[16.85px] rounded-[16.17px] border border-[rgba(255,255,255,0.30)] shadow-[0_10.78px_43.13px_rgba(29,97,231,0.15)] relative overflow-hidden">
            <div className="absolute w-[345px] h-[345px] -right-20 -top-10 rounded-full bg-white/10 blur-[53.91px]" />
            <div className="flex items-center gap-4 pb-5 border-b border-white/20 relative z-10">
              <div className="w-6 h-6 bg-[#FFDF93] rounded" />
              <h2 className="text-white text-[32px] font-semibold font-['Sora'] leading-[45.28px]">Found Item</h2>
              <div className="flex-1 text-right">
                <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-base font-semibold font-['Inter'] leading-[19.41px]">Found: Oct 25, 2023</span>
              </div>
            </div>
            <div className="mt-[26px] h-[259px] bg-white/10 rounded-[10.78px] overflow-hidden border border-white/30 shadow-[0_5.39px_8.09px_-5.39px_rgba(0,0,0,0.10),0_13.48px_20.21px_-4.04px_rgba(0,0,0,0.10)] flex items-center justify-center relative z-10">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="rgba(255,255,255,0.15)"/>
                <path d="M4 20L10 12L14 16L18 8L22 14V20H4Z" fill="rgba(255,255,255,0.3)"/>
                <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>
            <div className="mt-7 space-y-5 relative z-10">
              <FoundField label="Title" value="Black Sony Headphones" icon />
              <FoundField label="Category" value="Electronics > Audio" icon />
              <FoundField label="Location" value="Downtown Transit Hub (Near Cafe)" icon />
              <FoundField label="Description" value="Found these in a case on a bench outside the cafe area. Looks like there's a minor scuff mark on the side. Handed to transit security." noIcon description />
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 flex flex-col sm:flex-row gap-[21.56px] relative z-10">
              <button className="flex-1 h-20 bg-white rounded-[10.78px] shadow-[0_1.35px_2.7px_-1.35px_rgba(0,0,0,0.10),0_1.35px_4.04px_rgba(0,0,0,0.10)] flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                <svg width="27" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#1D61E7"/>
                </svg>
                <span className="text-[#1D61E7] text-lg font-medium font-['Inter'] leading-[22.64px] tracking-[0.94px]">This Is My Item</span>
              </button>
              <button className="flex-1 h-20 bg-white/10 rounded-[10.78px] border border-white/50 flex items-center justify-center gap-3 hover:bg-white/20 transition">
                <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="white"/>
                </svg>
                <span className="text-white text-lg font-medium font-['Inter'] leading-[22.64px] tracking-[0.94px]">Contact<br className="hidden sm:block" /> Finder</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function ReportField({ label, value, description }) {
  return (
    <div>
      <p className="text-[#64748B] text-base font-semibold font-['Inter'] leading-[19.41px]">{label}</p>
      <p className={`text-xl xl:text-[21.56px] font-['Inter'] leading-[34.5px] ${description ? 'text-[#64748B] font-normal' : 'text-[#1A253C] font-medium'}`}>{value}</p>
    </div>
  );
}

function FoundField({ label, value, icon, noIcon, description }) {
  return (
    <div>
      <div className="flex items-center gap-[10.78px] mb-[5.39px]">
        <p className="text-[rgba(255,255,255,0.80)] text-base font-semibold font-['Inter'] leading-[19.41px]">{label}</p>
        {icon && (
          <svg width="15.72" height="15.72" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
            <path d="M8 5V8.5M8 11V10.98" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className={`w-full p-[10.78px] rounded-[5.39px] ${noIcon ? '' : 'bg-[rgba(255,255,255,0.10)]'}`}>
        <p className={`text-xl xl:text-[21.56px] font-['Inter'] leading-[34.5px] ${description ? 'text-[rgba(255,255,255,0.90)] font-normal' : 'text-white font-medium'}`}>{value}</p>
      </div>
    </div>
  );
}

export default PossibleMatch;
