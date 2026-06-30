import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const mockPosts = [
  {
    id: 1,
    category: "Electronics > Audio",
    title: "Apple AirPods Pro",
    date: "Oct 24, 2023 \u2022 2:30 PM",
    serial: "AP-99482-XYZ",
    images: [
      "/src/assets/images/logo/logo.svg",
      "/src/assets/images/logo/logo.svg",
    ],
    identifiers: ["Small scratch on the right earbud", "Black silicone case cover"],
    description:
      "I left my AirPods Pro in their charging case on the table near the window at Blue Bottle Coffee. The case has a black silicone protective cover with a carabiner attached. The right earbud has a tiny scratch near the speaker mesh.",
    location: "Blue Bottle Coffee, Downtown",
    confidence: 85,
  },
];

function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPosts.find((p) => String(p.id) === String(id)) || mockPosts[0];

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-950">Review Your Report</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Please confirm the details of your lost item before publishing. Accuracy helps Findora AI match it faster.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-full bg-white/40 backdrop-blur border border-white/30 text-sm font-semibold text-slate-700 hover:bg-white/60 transition">Back</button>
                  <Link to={`/edit-report/${post.id}`} className="px-5 py-2.5 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">Edit Details</Link>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                <div className="rounded-2xl overflow-hidden bg-slate-100">
                  <img src={post.images[0]} alt="main" className="w-full h-64 object-cover" />
                </div>
                <div className="flex gap-3 mt-4">
                  {post.images.map((img, i) => (
                    <div key={i} className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 border-white/40">
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-300/40 flex items-center justify-center text-slate-400 bg-white/20">+</div>
                </div>

                <div className="mt-6 p-5 bg-white/25 backdrop-blur rounded-2xl border border-white/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-700">Match Confidence</h3>
                    <span className="text-blue-600 text-sm font-bold">{post.confidence}%</span>
                  </div>
                  <p className="text-xs text-slate-500">Based on your images and description, our AI predicts a high likelihood of matching.</p>
                  <div className="w-full bg-white/60 rounded-full h-2.5 mt-3 overflow-hidden">
                    <div className="h-2.5 bg-gradient-to-r from-blue-600 to-violet-500 rounded-full" style={{ width: `${post.confidence}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">{post.category}</p>
                    <h2 className="text-2xl font-bold text-slate-950 mt-1">{post.title}</h2>
                  </div>
                  <button className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-slate-500 hover:bg-white/50 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" /><path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" /></svg>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5">
                  <div className="p-4 bg-white/25 backdrop-blur rounded-2xl border border-white/30">
                    <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">Date & Time Lost</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-800">{post.date}</p>
                  </div>
                  <div className="p-4 bg-white/25 backdrop-blur rounded-2xl border border-white/30">
                    <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">Serial Number</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-800"># {post.serial}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500 mb-2">Distinctive Identifiers</p>
                  <div className="flex gap-2 flex-wrap">
                    {post.identifiers.map((i, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-white/30 border border-white/30 text-indigo-700 text-xs font-medium">{i}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500 mb-2">Detailed Description</p>
                  <div className="p-4 bg-white/25 backdrop-blur rounded-2xl border border-white/30 text-sm text-slate-700 leading-6">{post.description}</div>
                </div>

                <div className="mt-6 p-4 bg-white/25 backdrop-blur rounded-2xl border border-white/30 flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"><path d="M21 10C21 17 12 21 12 21C12 21 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                  <p className="text-xs text-slate-500">Last seen: <span className="font-semibold text-blue-600">{post.location}</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewPost;
