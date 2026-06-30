import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium font-['Inter'] transition-all ${
      isActive(path)
        ? "bg-[rgba(0,88,188,0.10)] text-[#0058BC]"
        : "text-[#717786] hover:bg-[rgba(0,88,188,0.05)] hover:text-[#0058BC]"
    }`;

  return (
    <aside className="w-64 h-full bg-white/75 backdrop-blur border-r border-white/20 shadow-[0_45px_75px_rgba(0,0,0,0.04)] px-4 py-6 flex flex-col shrink-0">
      <nav className="space-y-1 flex-1 overflow-y-auto">

        {/* Dashboard */}
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="13" y="3" width="8" height="4" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="3" y="14" width="8" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          Dashboard
        </Link>

        {/* Submit Report */}
        <p className="text-xs font-semibold uppercase text-[#717786] px-4 pt-6 pb-2 tracking-[1.2px] font-['Inter']">Submit Report</p>

        <Link to="/report-lost" className={linkClass("/report-lost")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M11 8V11L13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Lost Item
        </Link>

        <Link to="/report-found" className={linkClass("/report-found")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Found Item
        </Link>

        <Link to="/report-suspicious" className={linkClass("/report-suspicious")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
          </svg>
          Suspicious Item
        </Link>

        <Link to="/report-person" className={linkClass("/report-person")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M5 21C5 16.5 7.5 14 12 14C16.5 14 19 16.5 19 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Missing Person
        </Link>

        <Link to="/report-pet" className={linkClass("/report-pet")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.2" cy="6.2" r="1.6" fill="currentColor" />
            <circle cx="12" cy="4.2" r="1.6" fill="currentColor" />
            <circle cx="16.8" cy="6.2" r="1.6" fill="currentColor" />
            <path d="M12 9c-3 0-5 2-5 5 0 1.7 1.8 4 5 4s5-2.3 5-4c0-3-2-5-5-5z" fill="currentColor" />
          </svg>
          Missing Pet
        </Link>

        {/* My Reports */}
        <p className="text-xs font-semibold uppercase text-[#717786] px-4 pt-6 pb-2 tracking-[1.2px] font-['Inter']">My Reports</p>

        <Link to="/donation" className={linkClass("/donation")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9.5 4C11 4 12 5 12 5C12 5 13 4 14.5 4C17.5 4 20 6.5 20 9.5C20 15 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          My Donations
        </Link>

        <Link to="/rewards" className={linkClass("/rewards")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          Rewards
        </Link>

        <Link to="/matches" className={linkClass("/matches")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="9.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="14.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          Matches
        </Link>

        <Link to="/my-posts" className={linkClass("/my-posts")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="1.8" rx="2"/>
            <path d="M8 8H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M8 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M8 16H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          My Posts
        </Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
