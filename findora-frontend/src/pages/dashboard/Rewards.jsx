import DashboardLayout from "../../layouts/DashboardLayout";

function Rewards() {
  return (
    <DashboardLayout>
      <div className="min-h-screen" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, white 0%, #E1EAFE 100%)" }}>
        <div className="w-full max-w-[2160px] mx-auto p-6 sm:p-10 flex flex-col gap-6 sm:gap-8">

          {/* Header */}
          <div>
            <h1
              className="text-[48px] font-bold font-['Sora'] leading-[52.8px]"
              style={{ color: "#234FE4", textShadow: "0px 0px 10px rgba(179, 197, 255, 0.50)" }}
            >
              My Rewards
            </h1>
            <p className="text-[#00158C] text-lg font-['Inter'] font-normal leading-[28.8px] mt-2 max-w-[800px]">
              Earn recognition and rewards by helping reunite lost items, pets, and people.
              <br />
              Every contribution makes a difference.
            </p>
          </div>

          {/* Level Banner + Stats Row */}
          <div className="flex flex-col xl:flex-row gap-6 sm:gap-8">

            {/* Level Banner */}
            <div className="w-full xl:w-[440px] p-6 sm:p-8 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 flex items-center gap-5 sm:gap-7">
              {/* Avatar */}
              <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full bg-gradient-to-br from-[#234FE4] to-[#6D37D3] flex items-center justify-center shrink-0">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
                </svg>
              </div>
              {/* Level Info */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[#000313] text-2xl sm:text-[24px] font-semibold font-['Sora'] leading-[31.2px]">
                    Level 2
                  </span>
                  <span className="bg-[#FFE16D] text-[#221B00] text-sm font-bold font-['Inter'] leading-[20px] px-2.5 py-0.5 rounded">
                    L2
                  </span>
                </div>
                <span className="text-[#FFE16D] text-xs font-semibold font-['Inter'] uppercase leading-[12px] tracking-[1.2px] mt-1.5 block">
                  850 CONTRIBUTION SCORE
                </span>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Recoveries */}
              <div className="p-4 sm:p-6 bg-white/75 backdrop-blur rounded-2xl sm:rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 flex flex-col items-center justify-center text-center">
                <span className="text-[#00179B] text-[12px] font-semibold font-['Inter'] uppercase leading-[12px] tracking-[0.6px]">
                  TOTAL RECOVERIES
                </span>
                <span className="text-[#000208] text-[48px] font-bold font-['Sora'] leading-[52.8px] mt-2">
                  2
                </span>
              </div>
              {/* Rewards Earned */}
              <div className="p-4 sm:p-6 bg-white/75 backdrop-blur rounded-2xl sm:rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 flex flex-col items-center justify-center text-center">
                <span className="text-[#001693] text-[12px] font-semibold font-['Inter'] uppercase leading-[12px] tracking-[0.6px]">
                  REWARDS EARNED
                </span>
                <span className="text-black text-[48px] font-bold font-['Sora'] leading-[52.8px] mt-2">
                  0
                </span>
              </div>
              {/* Current Points */}
              <div className="p-4 sm:p-6 bg-white/75 backdrop-blur rounded-2xl sm:rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 flex flex-col items-center justify-center text-center">
                <span className="text-[#001DC0] text-[12px] font-semibold font-['Inter'] uppercase leading-[12px] tracking-[0.6px]">
                  CURRENT POINTS
                </span>
                <span className="text-black text-[48px] font-bold font-['Sora'] leading-[52.8px] mt-2">
                  850
                </span>
              </div>
              {/* Community Rank */}
              <div className="p-4 sm:p-6 bg-white/75 backdrop-blur rounded-2xl sm:rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 flex flex-col items-center justify-center text-center">
                <span className="text-[#00137B] text-[12px] font-semibold font-['Inter'] uppercase leading-[12px] tracking-[0.6px]">
                  COMMUNITY RANK
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-black text-[48px] font-bold font-['Sora'] leading-[52.8px]">
                    #124
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Next Milestone + Recent Badges Row */}
          <div className="flex flex-col xl:flex-row gap-6 sm:gap-8">

            {/* Next Milestone */}
            <div className="w-full xl:w-[440px] p-6 sm:p-8 rounded-3xl" style={{ background: "linear-gradient(180deg, #0B1124 0%, #050814 100%)" }}>
              <div className="flex flex-col gap-4 sm:gap-5">
                <span className="text-[#FFE16D] text-[12px] font-semibold font-['Inter'] uppercase leading-[12px] tracking-[1.2px]">
                  NEXT MILESTONE
                </span>
                <h3 className="text-[#DAE2FD] text-2xl sm:text-[24px] font-semibold font-['Sora'] leading-[31.2px]">
                  Rs.100 Mobile Reload
                </h3>
                <p className="text-[#031FBF] text-base font-['Inter'] font-normal leading-[24px]">
                  You are just one successful recovery away from claiming your next
                  <br />
                  reward. Keep an eye on local missing reports to help out!
                </p>
                <button className="w-full py-3 sm:py-4 rounded-xl border border-[rgba(195,198,215,0.25)] text-[#C3C6D7] text-[12px] font-semibold font-['Inter'] uppercase leading-[12px] tracking-[0.6px] hover:bg-white/5 transition">
                  CLAIM REWARD
                </button>
              </div>
            </div>

            {/* Recent Badges */}
            <div className="flex-1 p-6 sm:p-8 rounded-3xl" style={{ background: "linear-gradient(180deg, #0B1124 0%, #050814 100%)" }}>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-[#DAE2FD] text-2xl sm:text-[24px] font-semibold font-['Sora'] leading-[31.2px]">
                  Recent Badges
                </h3>
                <button className="text-[#B3C5FF] text-[12px] font-semibold font-['Inter'] leading-[12px] tracking-[0.3px] hover:underline">
                  View All Badges
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Recovery - Unlocked */}
                <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FFE16D] to-[#FFB800] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#221B00"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#DAE2FD] text-[12px] font-semibold font-['Inter'] leading-[12px] tracking-[0.6px]">
                      First Recovery
                    </p>
                    <p className="text-[#B3C5FF] text-[10px] font-['JetBrains Mono'] font-normal leading-[15px] mt-1">
                      Unlocked
                    </p>
                  </div>
                </div>

                {/* Top Contributor - Locked */}
                <div className="p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center text-center gap-3 opacity-60">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#8D90A0"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#C3C6D7] text-[12px] font-semibold font-['Inter'] leading-[12px] tracking-[0.6px]">
                      Top Contributor
                    </p>
                    <p className="text-[#8D90A0] text-[10px] font-['JetBrains Mono'] font-normal leading-[15px] mt-1">
                      Locked
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Rewards;
