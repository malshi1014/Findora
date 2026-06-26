import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Report Find Items", path: "/report-found", icon: "reportFind" },
  { label: "Report Lost Item", path: "/report-lost", icon: "reportLost" },
  { label: "Report Missing People", path: "/report-person", icon: "reportPerson" },
  { label: "Report Missing Pets", path: "/report-pet", icon: "reportPet" },
  { label: "My Posts", path: "/my-posts", icon: "myPosts" },
  { label: "Notifications", path: "/notifications", icon: "notifications" },
  { label: "Donations", path: "/donation", icon: "donations" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return (
    <aside className="flex min-h-screen w-[420px] shrink-0 flex-col bg-[rgba(252,248,251,0.80)] shadow-[45px_0px_75px_rgba(0,0,0,0.04)] backdrop-blur-[30px]">
      {/* Logo */}
      <div className="flex items-start px-6 pt-6 pb-[60px]">
        <img src="https://placehold.co/396x142" alt="Findora" className="h-[142px] w-[396px]" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mx-[14px] flex items-center gap-6 px-6 py-[18px] text-[18px] font-medium leading-[24px] tracking-[0.36px] transition-colors ${
                isActive
                  ? "border-l-[6px] border-[#0058BC] bg-[rgba(0,88,188,0.10)] text-[#0058BC]"
                  : "border-l-[6px] border-transparent text-[#414755] hover:bg-[rgba(0,88,188,0.05)]"
              }`
            }
          >
            <span className="flex h-[30px] w-[30px] items-center justify-center">
              <NavIcon type={item.icon} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-6 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-6 bg-[#1D61E7] px-6 py-[18px] text-left"
        >
          <span className="flex h-[27px] w-[27px] items-center justify-center">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
              <path
                d="M16.875 18.5625L22.5 13.5M22.5 13.5L16.875 8.4375M22.5 13.5H9M11.25 22.5H5.625C5.00368 22.5 4.5 21.9963 4.5 21.375V5.625C4.5 5.00368 5.00368 4.5 5.625 4.5H11.25"
                stroke="#F8FAFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-center text-[18px] font-medium leading-[24px] tracking-[0.36px] text-[#F8FAFF]">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

function NavIcon({ type }) {
  switch (type) {
    case "dashboard":
      return (
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
          <rect x="2" y="2" width="9.5" height="9.5" rx="2" fill="currentColor" />
          <rect x="15.5" y="2" width="9.5" height="9.5" rx="2" fill="currentColor" />
          <rect x="2" y="15.5" width="9.5" height="9.5" rx="2" fill="currentColor" />
          <rect x="15.5" y="15.5" width="9.5" height="9.5" rx="2" fill="currentColor" />
        </svg>
      );
    case "reportFind":
      return (
        <svg width="25" height="23" viewBox="0 0 25 23" fill="none">
          <path
            d="M12.5 0L15.45 8.5H24.5L17.25 13.5L19.75 22L12.5 17L5.25 22L7.75 13.5L0.5 8.5H9.55L12.5 0Z"
            fill="currentColor"
          />
        </svg>
      );
    case "reportLost":
      return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
          <circle cx="12.5" cy="12.5" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12.5 7V13M12.5 17V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "reportPerson":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "reportPet":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8C10 8 8 10 8 12C8 14 10 16 12 16C14 16 16 14 16 12C16 10 14 8 12 8Z"
            fill="currentColor"
          />
          <path d="M12 2L14 6H10L12 2Z" fill="currentColor" />
          <path d="M12 22L10 18H14L12 22Z" fill="currentColor" />
          <path d="M2 12L6 10V14L2 12Z" fill="currentColor" />
          <path d="M22 12L18 14V10L22 12Z" fill="currentColor" />
        </svg>
      );
    case "myPosts":
      return (
        <svg width="29.32" height="30" viewBox="0 0 30 31" fill="none">
          <path
            d="M5 3.5H25C26.1 3.5 27 4.4 27 5.5V25.5C27 26.6 26.1 27.5 25 27.5H5C3.9 27.5 3 26.6 3 25.5V5.5C3 4.4 3.9 3.5 5 3.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 10.5H22M8 16.5H16M8 22.5H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "notifications":
      return (
        <svg width="24" height="30" viewBox="0 0 22 28" fill="none">
          <path
            d="M11 27C12.1 27 13 26.1 13 25H9C9 26.1 9.9 27 11 27ZM18 21V14C18 9.9 15.9 6.3 12 5.3V4.5C12 3.7 11.3 3 10.5 3C9.7 3 9 3.7 9 4.5V5.3C5.1 6.3 3 9.9 3 14V21L1 23V24H20V23L18 21Z"
            fill="currentColor"
          />
        </svg>
      );
    case "donations":
      return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path
            d="M12.5 2.5C7.5 2.5 3.5 6.5 3.5 11.5C3.5 18 12.5 22.5 12.5 22.5C12.5 22.5 21.5 18 21.5 11.5C21.5 6.5 17.5 2.5 12.5 2.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12.5" cy="11.5" r="3" fill="currentColor" />
        </svg>
      );
    case "settings":
      return (
        <svg width="30.15" height="30" viewBox="0 0 31 30" fill="none">
          <circle cx="15.5" cy="15" r="5" fill="currentColor" />
          <path
            d="M15.5 2.5V7.5M15.5 22.5V27.5M7.5 15H2.5M28.5 15H23.5M9.5 9L6 5.5M25.5 24.5L22 21M22 9L25.5 5.5M6 24.5L9.5 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default Sidebar;
