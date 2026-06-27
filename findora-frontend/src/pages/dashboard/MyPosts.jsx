import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const posts = [
  { id: 1, type: "Lost", title: "Sony WH-1000XM4 Headphones", status: "Active", date: "Oct 24, 2023", matches: 2 },
  { id: 2, type: "Found", title: "Black Leather Wallet", status: "Active", date: "Oct 20, 2023", matches: 1 },
  { id: 3, type: "Missing Person", title: "Emily Watson", status: "Resolved", date: "Oct 15, 2023", matches: 0 },
  { id: 4, type: "Lost", title: "Silver Samsung Galaxy Watch", status: "Active", date: "Oct 12, 2023", matches: 1 },
  { id: 5, type: "Found", title: "Brown Labrador Retriever", status: "Active", date: "Oct 10, 2023", matches: 1 },
];

const typeStyles = {
  Lost: "bg-red-50 text-red-600",
  Found: "bg-blue-50 text-blue-600",
  "Missing Person": "bg-red-50 text-red-600",
};

const statusStyles = {
  Active: "bg-blue-50 text-blue-700",
  Resolved: "bg-green-50 text-green-700",
};

function MyPosts() {
  return (
    <DashboardLayout>
      <div className="min-h-screen" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, white 0%, #E1EAFE 100%)" }}>
        <div className="w-full max-w-[2160px] mx-auto p-6 sm:p-10 flex flex-col gap-6 sm:gap-8">

          {/* Header */}
          <div>
            <span className="inline-block px-4 sm:px-[18px] py-1 sm:py-[6px] bg-[rgba(0,88,188,0.10)] rounded-full text-[#0058BC] text-xs sm:text-base font-semibold font-[Inter] tracking-[0.83px]">
              MY REPORTS
            </span>
            <h1 className="text-[#1B1B1D] text-3xl sm:text-[48px] font-bold font-[Inter] leading-tight sm:leading-[60px] pt-3">
              My Posts
            </h1>
            <p className="text-[#717786] text-base sm:text-xl font-normal font-[Inter] leading-snug sm:leading-[30px] max-w-[600px]">
              Manage all your reports and listings.
            </p>
          </div>

          {/* Post Cards */}
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 sm:p-8 bg-white/75 backdrop-blur rounded-3xl shadow-[0_45px_75px_rgba(0,0,0,0.04)] border border-white/20 hover:shadow-[0_45px_75px_rgba(0,88,188,0.08)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Type Badge */}
                    <span className={`w-16 sm:w-20 text-center px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold font-[Inter] ${typeStyles[post.type]}`}>
                      {post.type === "Missing Person" ? "Missing" : post.type}
                    </span>
                    <div>
                      <p className="text-[#1B1B1D] text-base sm:text-2xl font-bold font-[Inter] leading-snug sm:leading-[36px]">{post.title}</p>
                      <p className="text-[#9CA3AF] text-xs sm:text-sm font-normal font-[Inter] mt-0.5">{post.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {post.matches > 0 && (
                      <Link
                        to="/matches"
                        className="text-[#0058BC] text-xs sm:text-sm font-semibold font-[Inter] hover:underline"
                      >
                        {post.matches} match{post.matches > 1 ? "es" : ""}
                      </Link>
                    )}
                    <span className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold font-[Inter] tracking-[0.36px] ${statusStyles[post.status]}`}>
                      {post.status}
                    </span>
                    <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[rgba(0,88,188,0.06)] flex items-center justify-center hover:bg-[rgba(0,88,188,0.12)] transition">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 10.75C10.4142 10.75 10.75 10.4142 10.75 10C10.75 9.58579 10.4142 9.25 10 9.25C9.58579 9.25 9.25 9.58579 9.25 10C9.25 10.4142 9.58579 10.75 10 10.75Z" stroke="#64748B" strokeWidth="1.5"/>
                        <path d="M10 5.25C10.4142 5.25 10.75 4.91421 10.75 4.5C10.75 4.08579 10.4142 3.75 10 3.75C9.58579 3.75 9.25 4.08579 9.25 4.5C9.25 4.91421 9.58579 5.25 10 5.25Z" stroke="#64748B" strokeWidth="1.5"/>
                        <path d="M10 16.25C10.4142 16.25 10.75 15.9142 10.75 15.5C10.75 15.0858 10.4142 14.75 10 14.75C9.58579 14.75 9.25 15.0858 9.25 15.5C9.25 15.9142 9.58579 16.25 10 16.25Z" stroke="#64748B" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyPosts;
