import DashboardLayout from "../../layouts/DashboardLayout";

function UserDashboard() {
  return (
    <DashboardLayout>
      <div className="w-full h-full" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, white 0%, #E1EAFE 100%)" }}>
        <div className="w-full max-w-[2160px] mx-auto p-6 sm:p-10 flex flex-col gap-6 sm:gap-10">

          {/* Dashboard Overview + Profile Strength Row */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">

            {/* Dashboard Overview Card */}
            <div className="flex-1 p-6 sm:p-12 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-[302px] h-[459px] opacity-20">
                <div className="w-full h-full bg-gradient-to-b from-white to-white opacity-30" />
              </div>
              <div className="flex flex-col gap-3 sm:gap-4">
                <span className="inline-block px-4 sm:px-[18px] py-1 sm:py-[6px] bg-[rgba(0,88,188,0.10)] rounded-full text-[#0058BC] text-xs sm:text-base font-semibold font-[Inter] tracking-[0.83px]">
                  DASHBOARD OVERVIEW
                </span>
                <h1 className="text-[#1B1B1D] text-2xl sm:text-[48px] font-bold font-[Inter] leading-tight sm:leading-[60px] pt-3 sm:pt-[12px]">
                  Welcome back, Duvindu!
                </h1>
                <p className="text-[#414755] text-base sm:text-2xl font-normal font-[Inter] leading-snug sm:leading-[36px] max-w-[672px] pb-4 sm:pb-6">
                  You have <span className="text-[#0058BC]">3 new matches</span> for your lost items. Let&apos;s get them back to you.
                </p>
                <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-[rgba(0,88,188,0.05)] rounded-2xl border border-[rgba(0,88,188,0.10)] max-w-[576px]">
                  <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] bg-[rgba(0,88,188,0.20)] rounded-xl sm:rounded-[18px] flex items-center justify-center">
                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="33" height="31.5" rx="4" fill="#0058BC" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#0058BC] text-base sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">Recovery Success!</p>
                    <p className="text-[#717786] text-sm sm:text-lg font-medium font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px]">Your Sony Headphones were returned.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Strength Card */}
            <div className="w-full lg:w-[400px] p-6 sm:p-12 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-[rgba(0,88,188,0.20)] flex flex-col justify-between">
              <div className="flex flex-col gap-4 sm:gap-6 pb-6 sm:pb-9">
                <div className="flex justify-between items-start pb-2 sm:pb-3">
                  <h2 className="text-[#1B1B1D] text-xl sm:text-[30px] font-bold font-[Inter] leading-snug sm:leading-[42px]">Profile Strength</h2>
                  <span className="text-[#0058BC] text-xl sm:text-[30px] font-bold font-[Inter] leading-snug sm:leading-[42px]">85%</span>
                </div>
                <div className="w-full h-[18px] bg-[#EAE7EA] rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-gradient-to-r from-[#0058BC] to-[#6D37D3] rounded-full shadow-[0_6px_9px_-6px_rgba(0,0,0,0.10),0_15px_22.5px_-4.5px_rgba(0,0,0,0.10)]" />
                </div>
                <p className="text-[#414755] text-sm sm:text-lg font-medium font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px]">
                  Complete your identity verification to increase your trust score among the Findora community.
                </p>
              </div>
              <button className="w-full py-3 sm:py-[18px] rounded-xl sm:rounded-[18px] border border-[rgba(0,88,188,0.30)] text-[#0058BC] text-base sm:text-2xl font-bold font-[Inter] leading-snug sm:leading-[36px] hover:bg-[rgba(0,88,188,0.05)] transition">
                Verify Identity Now
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex flex-col gap-6 sm:gap-9">
            <h2 className="text-[#1B1B1D] text-xl sm:text-[30px] font-bold font-[Inter] leading-snug sm:leading-[42px]">Recent Activity</h2>

            <div className="p-6 sm:p-9 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 flex flex-col gap-6 sm:gap-9">
              {/* Activity Item 1 */}
              <div className="relative pl-8 sm:pl-12 pb-6 sm:pb-9 border-l border-[rgba(113,119,134,0.10)] flex flex-col gap-1 sm:gap-[6px]">
                <div className="absolute -left-[7px] top-0 w-[15px] h-[15px] rounded-full bg-[#0058BC] shadow-[0_0_0_6px_rgba(0,88,188,0.20)]" />
                <p className="text-[#0058BC] text-xs sm:text-base font-bold font-[Inter] leading-snug sm:leading-[24px] tracking-[0.83px]">TODAY, 10:45 AM</p>
                <p className="text-[#1B1B1D] text-sm sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">New Match Found</p>
                <p className="text-[#414755] text-sm sm:text-lg font-medium font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px]">
                  AI detected a strong match for your &quot;Blue Backpack&quot; in the Transit hub.
                </p>
              </div>

              {/* Activity Item 2 */}
              <div className="relative pl-8 sm:pl-12 pb-6 sm:pb-9 border-l border-[rgba(113,119,134,0.10)] flex flex-col gap-1 sm:gap-[6px]">
                <div className="absolute -left-[7px] top-0 w-[15px] h-[15px] rounded-full bg-[#6D37D3] shadow-[0_0_0_6px_rgba(109,55,211,0.20)]" />
                <p className="text-[#6D37D3] text-xs sm:text-base font-bold font-[Inter] leading-snug sm:leading-[24px] tracking-[0.83px]">YESTERDAY, 4:20 PM</p>
                <p className="text-[#1B1B1D] text-sm sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">Claim Accepted</p>
                <p className="text-[#414755] text-sm sm:text-lg font-medium font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px]">
                  The finder of your &quot;House Keys&quot; has verified your claim.
                </p>
              </div>

              {/* Activity Item 3 */}
              <div className="relative pl-8 sm:pl-12 border-l border-[rgba(113,119,134,0.10)] flex flex-col gap-1 sm:gap-[6px]">
                <div className="absolute -left-[7px] top-0 w-[15px] h-[15px] rounded-full bg-[#717786] shadow-[0_0_0_6px_rgba(113,119,134,0.20)]" />
                <p className="text-[#717786] text-xs sm:text-base font-bold font-[Inter] leading-snug sm:leading-[24px] tracking-[0.83px]">OCT 12, 9:00 AM</p>
                <p className="text-[#1B1B1D] text-sm sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">Post Created</p>
                <p className="text-[#414755] text-sm sm:text-lg font-medium font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px]">
                  You reported a &quot;Silver Ring&quot; found in Golden Gate Park.
                </p>
              </div>
            </div>
          </div>

          {/* My Recent Posts */}
          <div className="flex flex-col gap-6 sm:gap-9 pb-10 sm:pb-[159px]">
            <div className="flex justify-between items-center">
              <h2 className="text-[#1B1B1D] text-xl sm:text-[30px] font-bold font-[Inter] leading-snug sm:leading-[42px]">My Recent Posts</h2>
              <span className="text-[#0058BC] text-sm sm:text-lg font-bold font-[Inter] leading-snug sm:leading-[24px] tracking-[0.36px] cursor-pointer hover:underline">View All Posts</span>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Post 1 */}
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20">
                <div className="w-20 h-20 sm:w-[144px] sm:h-[144px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <div className="w-full h-full bg-gray-200" />
                </div>
                <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-4 h-full min-h-[80px] sm:min-h-[144px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-[#1B1B1D] text-sm sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">Blue Backpack</h3>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-[3px] bg-[rgba(109,55,211,0.10)] rounded text-[#6D37D3] text-xs sm:text-sm font-bold font-[Inter] uppercase leading-snug sm:leading-[22.5px]">LOST</span>
                    </div>
                    <p className="text-[#717786] text-xs sm:text-base font-semibold font-[Inter] leading-snug sm:leading-[24px] tracking-[0.83px] mt-1">Reported: Oct 14, 2023</p>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button className="p-1 sm:p-[6px] rounded bg-gray-100 hover:bg-gray-200 transition">
                      <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20.25" height="20.25" rx="3" fill="#0058BC" />
                      </svg>
                    </button>
                    <button className="p-1 sm:p-[6px] rounded bg-gray-100 hover:bg-gray-200 transition">
                      <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="20.25" rx="3" fill="#BA1A1A" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Post 2 */}
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20">
                <div className="w-20 h-20 sm:w-[144px] sm:h-[144px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <div className="w-full h-full bg-gray-200" />
                </div>
                <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-4 h-full min-h-[80px] sm:min-h-[144px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-[#1B1B1D] text-sm sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">Car Keys</h3>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-[3px] bg-[rgba(0,88,188,0.10)] rounded text-[#0058BC] text-xs sm:text-sm font-bold font-[Inter] uppercase leading-snug sm:leading-[22.5px]">FOUND</span>
                    </div>
                    <p className="text-[#717786] text-xs sm:text-base font-semibold font-[Inter] leading-snug sm:leading-[24px] tracking-[0.83px] mt-1">Reported: Oct 12, 2023</p>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button className="p-1 sm:p-[6px] rounded bg-gray-100 hover:bg-gray-200 transition">
                      <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20.25" height="20.25" rx="3" fill="#0058BC" />
                      </svg>
                    </button>
                    <button className="p-1 sm:p-[6px] rounded bg-gray-100 hover:bg-gray-200 transition">
                      <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="20.25" rx="3" fill="#BA1A1A" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Add New Post */}
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 cursor-pointer hover:bg-white/90 transition">
                <div className="w-20 h-20 sm:w-[144px] sm:h-[144px] rounded-xl sm:rounded-2xl bg-[#F0EDEF] flex items-center justify-center flex-shrink-0">
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="35" height="35" rx="4" fill="#717786" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#414755] text-sm sm:text-xl font-bold font-[Inter] leading-snug sm:leading-[30px]">
                    Report another item...
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;
