import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const activities = [
  {
    date: "TODAY, 10:45 AM",
    title: "New Match Found",
    description: 'AI detected a strong match for\nyour "Blue Backpack" in the\nTransit hub.',
    color: "#0058BC",
  },
  {
    date: "YESTERDAY, 4:20 PM",
    title: "Claim Accepted",
    description: 'The finder of your "House Keys"\nhas verified your claim.',
    color: "#6D37D3",
  },
  {
    date: "OCT 12, 9:00 AM",
    title: "Post Created",
    description: 'You reported a "Silver Ring" found\nin Golden Gate Park.',
    color: "#717786",
  },
];

const posts = [
  {
    title: "Blue Backpack",
    status: "LOST",
    statusColor: "#6D37D3",
    date: "Oct 14, 2023",
    img: true,
  },
  {
    title: "Car Keys",
    status: "FOUND",
    statusColor: "#0058BC",
    date: "Oct 12, 2023",
    img: true,
  },
];

function UserDashboard() {
  return (
    <DashboardLayout>
      <div
        className="relative min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, #fff 0%, #E1EAFE 100%)",
        }}
      >
        <div className="mx-auto max-w-[1500px] px-10 py-24">
          <div className="flex flex-col gap-10">
            {/* Welcome Card */}
            <div className="rounded-[36px] bg-white/75 p-12 shadow-[0_45px_75px_rgba(0,0,0,0.04)] backdrop-blur-[15px] ring-1 ring-white/20">
              <div className="flex flex-col gap-3">
                <div className="inline-flex w-fit items-center rounded-[14998.5px] bg-[rgba(0,88,188,0.10)] px-[18px] py-[6px]">
                  <span className="text-[16.5px] font-semibold tracking-[0.83px] text-[#0058BC]">
                    DASHBOARD OVERVIEW
                  </span>
                </div>
                <h1 className="pt-3 text-[48px] font-bold leading-[60px] text-[#1B1B1D]">
                  Welcome back, Duvindu!
                </h1>
                <div className="max-w-[672px] pb-6">
                  <p className="text-[24px] font-normal leading-[36px] text-[#414755]">
                    You have{" "}
                    <span className="text-[#0058BC]">3 new matches</span> for
                    your lost items. Let&apos;s get them back to you.
                  </p>
                </div>
                <div className="inline-flex max-w-[576px] items-center gap-6 rounded-[24px] border border-[rgba(0,88,188,0.10)] bg-[rgba(0,88,188,0.05)] p-6">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[rgba(0,88,188,0.20)]">
                    <svg
                      width="33"
                      height="31.5"
                      viewBox="0 0 33 32"
                      fill="none"
                    >
                      <path
                        d="M16.5 0L20.4 11.3L32.5 11.3L22.9 18.6L26.2 30L16.5 22.8L6.8 30L10.1 18.6L0.5 11.3L12.6 11.3L16.5 0Z"
                        fill="#0058BC"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[21px] font-bold leading-[30px] text-[#0058BC]">
                      Recovery Success!
                    </span>
                    <span className="text-[18px] font-medium leading-[24px] tracking-[0.36px] text-[#717786]">
                      Your Sony Headphones were returned.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Recent Activity */}
              <div className="flex-1">
                <h2 className="mb-9 text-[30px] font-bold leading-[42px] text-[#1B1B1D]">
                  Recent Activity
                </h2>
                <div className="flex flex-col gap-9 rounded-[36px] bg-white/75 p-9 shadow-[0_45px_75px_rgba(0,0,0,0.04)] backdrop-blur-[15px] ring-1 ring-white/20">
                  {activities.map((item, i) => (
                    <div
                      key={i}
                      className="relative flex flex-col gap-1.5 border-l-[1.5px] border-[rgba(113,119,134,0.10)] pb-9 pl-12 last:pb-0"
                    >
                      <span
                        className="text-[16.5px] font-bold leading-[24px] tracking-[0.83px]"
                        style={{ color: item.color }}
                      >
                        {item.date}
                      </span>
                      <span className="text-[21px] font-bold leading-[30px] text-[#1B1B1D]">
                        {item.title}
                      </span>
                      <span className="whitespace-pre-line text-[18px] font-medium leading-[24px] tracking-[0.36px] text-[#414755]">
                        {item.description}
                      </span>
                      <div
                        className="absolute left-0 top-0 flex h-[15px] w-[15px] -translate-x-1/2 items-center justify-start"
                        style={{ left: "-1.5px" }}
                      >
                        <div
                          className="h-[15px] w-[15px] rounded-full"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 0 6px ${item.color}33`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Strength */}
              <div className="w-full max-w-sm lg:max-w-[380px]">
                <div className="flex flex-col rounded-[36px] bg-white/75 p-12 shadow-[0_45px_75px_rgba(0,0,0,0.04)] backdrop-blur-[15px] ring-1 ring-[rgba(0,88,188,0.20)]">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <span className="text-[30px] font-bold leading-[42px] text-[#1B1B1D]">
                        Profile Strength
                      </span>
                      <span className="text-[30px] font-bold leading-[42px] text-[#0058BC]">
                        85%
                      </span>
                    </div>
                    <div className="h-[18px] w-full overflow-hidden rounded-[14998.5px] bg-[#EAE7EA]">
                      <div
                        className="h-full rounded-[14998.5px]"
                        style={{
                          width: "286.46px",
                          background:
                            "linear-gradient(176deg, #0058BC 0%, #6D37D3 100%)",
                          boxShadow:
                            "0px 6px 9px -6px rgba(0,0,0,0.10), 0px 15px 22.5px -4.5px rgba(0,0,0,0.10)",
                        }}
                      />
                    </div>
                    <span className="text-[18px] font-medium leading-[24px] tracking-[0.36px] text-[#414755]">
                      Complete your identity verification to increase your trust
                      score among the Findora community.
                    </span>
                  </div>
                  <button className="mt-[18px] w-full rounded-[18px] border border-[rgba(0,88,188,0.30)] py-[18px] text-center text-[24px] font-bold leading-[36px] text-[#0058BC]">
                    Verify Identity Now
                  </button>
                </div>
              </div>
            </div>

            {/* My Recent Posts */}
            <div className="pb-[159px]">
              <div className="mb-9 flex items-center justify-between">
                <h2 className="text-[30px] font-bold leading-[42px] text-[#1B1B1D]">
                  My Recent Posts
                </h2>
                <Link
                  to="/my-posts"
                  className="text-center text-[18px] font-bold leading-[24px] tracking-[0.36px] text-[#0058BC]"
                >
                  View All Posts
                </Link>
              </div>
              <div className="flex flex-col gap-0">
                {posts.map((post, i) => (
                  <div
                    key={i}
                    className="inline-flex h-[195px] items-start gap-6 rounded-[36px] bg-white/75 p-6 shadow-[0_45px_75px_rgba(0,0,0,0.04)] backdrop-blur-[15px] ring-1 ring-white/20"
                  >
                    <div className="flex h-[144px] w-[144px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-[#F0EDEF]">
                      {post.img ? (
                        <div className="h-full w-full bg-[#D9D9D9]" />
                      ) : (
                        <svg
                          width="35"
                          height="35"
                          viewBox="0 0 35 35"
                          fill="none"
                        >
                          <rect
                            width="35"
                            height="35"
                            rx="5"
                            fill="#717786"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex h-full flex-1 flex-col justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-start justify-between">
                          <span className="text-[21px] font-bold leading-[30px] text-[#1B1B1D]">
                            {post.title}
                          </span>
                          <div
                            className="inline-flex items-center rounded-[6px] px-3 py-[3px]"
                            style={{
                              backgroundColor: `${post.statusColor}1A`,
                            }}
                          >
                            <span
                              className="text-[15px] font-bold uppercase leading-[22.5px]"
                              style={{ color: post.statusColor }}
                            >
                              {post.status}
                            </span>
                          </div>
                        </div>
                        <span className="text-[16.5px] font-semibold leading-[24px] tracking-[0.83px] text-[#717786]">
                          Reported: {post.date}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <button className="rounded-[6px] p-[6px]">
                          <svg
                            width="20.25"
                            height="20.25"
                            viewBox="0 0 21 21"
                            fill="none"
                          >
                            <path
                              d="M17.7188 2.125H3.28125C2.64375 2.125 2.125 2.64375 2.125 3.28125V17.7188C2.125 18.3562 2.64375 18.875 3.28125 18.875H17.7188C18.3562 18.875 18.875 18.3562 18.875 17.7188V3.28125C18.875 2.64375 18.3562 2.125 17.7188 2.125Z"
                              fill="#0058BC"
                            />
                          </svg>
                        </button>
                        <button className="rounded-[6px] p-[6px]">
                          <svg
                            width="18"
                            height="20.25"
                            viewBox="0 0 19 22"
                            fill="none"
                          >
                            <path
                              d="M16.5 21L9.5 17L2.5 21V3C2.5 2.46957 2.71071 1.96086 3.08579 1.58579C3.46086 1.21071 3.96957 1 4.5 1H14.5C15.0304 1 15.5391 1.21071 15.9142 1.58579C16.2893 1.96086 16.5 2.46957 16.5 3V21Z"
                              fill="#BA1A1A"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new item card */}
                <div className="inline-flex h-[195px] items-start gap-6 rounded-[36px] bg-white/75 p-6 shadow-[0_45px_75px_rgba(0,0,0,0.04)] backdrop-blur-[15px] ring-1 ring-white/20">
                  <div className="flex h-[144px] w-[144px] shrink-0 items-center justify-center rounded-[24px] bg-[#F0EDEF]">
                    <svg
                      width="35"
                      height="35"
                      viewBox="0 0 35 35"
                      fill="none"
                    >
                      <rect width="35" height="35" rx="5" fill="#717786" />
                    </svg>
                  </div>
                  <div className="flex h-full flex-1 items-center">
                    <span className="text-[21px] font-bold leading-[30px] text-[#414755]">
                      Report another
                      <br />
                      item...
                    </span>
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

export default UserDashboard;
