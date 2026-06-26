import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen flex">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <div className="fixed right-0 top-0 z-50 flex h-24 w-[calc(100%-420px)] items-center border-b-[1.5px] border-[rgba(113,119,134,0.10)] bg-[rgba(252,248,251,0.70)] px-8 shadow-[0_1.5px_3px_rgba(0,0,0,0.05)] backdrop-blur-[18px]">
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-[24px] font-bold leading-5 text-[#424654]"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-[24px] font-semibold leading-5 text-[#424654]"
            >
              About us
            </Link>
            <Link
              to="/contact"
              className="text-[24px] font-semibold leading-5 text-[#424654]"
            >
              Contact Us
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-4 border-l-[1.5px] border-[rgba(113,119,134,0.10)] pl-6">
            <div className="flex flex-col items-end">
              <span className="text-[21px] font-bold leading-[21px] text-[#1B1B1D]">
                Duvindu
              </span>
            </div>
            <div className="h-[60px] w-[60px] overflow-hidden rounded-full ring-3 ring-[rgba(0,88,188,0.20)]">
              <img
                src="https://placehold.co/60x60"
                alt="Duvindu"
                className="h-full w-full rounded-full border-[1.5px] border-[#C3C6D7] object-cover"
              />
            </div>
          </div>
        </div>

        <main className="flex-1 pt-24">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
