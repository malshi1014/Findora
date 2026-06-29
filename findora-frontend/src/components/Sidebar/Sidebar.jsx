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
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 5C10 3 11.5 2 12 2C12.5 2 14 3 14 5C14 6.5 12 8 12 8C12 8 10 6.5 10 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M6 12C4 12 3 10.5 3 9.5C3 8 4.5 7 6 7C8 7 9 9 9 9C9 9 8 12 6 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M18 12C20 12 21 10.5 21 9.5C21 8 19.5 7 18 7C16 7 15 9 15 9C15 9 16 12 18 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 22C16.5 22 18 18 18 15C18 12.5 16 11 12 11C8 11 6 12.5 6 15C6 18 7.5 22 12 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="8" cy="14" r="0.8" fill="currentColor"/>
            <circle cx="16" cy="14" r="0.8" fill="currentColor"/>
            <path d="M10 18C10 18 11 19 12 19C13 19 14 18 14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Missing Pet
        </Link>

        {/* My Reports */}
        <p className="text-xs font-semibold uppercase text-[#717786] px-4 pt-6 pb-2 tracking-[1.2px] font-['Inter']">My Reports</p>

        <Link to="/donation" className={linkClass("/donation")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 6V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          My Donations
        </Link>

        <Link to="/rewards" className={linkClass("/rewards")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 15L9 19L12 17L15 19L12 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <rect x="4" y="3" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M6 8V17C6 18.5 8 20 12 20C16 20 18 18.5 18 17V8" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          Rewards
        </Link>

        <Link to="/matches" className={linkClass("/matches")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
