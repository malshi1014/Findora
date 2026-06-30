import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const mockPosts = [
  {
    id: 1,
    category: "Electronics > Audio",
    title: "Apple AirPods Pro",
    date: "Oct 24, 2023 • 2:30 PM",
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
      <div className="min-h-full relative p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Review Your Report</h1>
              <p className="text-sm text-slate-500 mt-2">Please confirm the details of your lost item before publishing. Accuracy helps Findora AI match it faster.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-full bg-white/30 backdrop-blur text-sm">Back</button>
              <Link to={`/edit-report/${post.id}`} className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm">Edit Details</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[20px] border border-white/30">
              <div className="rounded-lg overflow-hidden bg-slate-100">
                <img src={post.images[0]} alt="main" className="w-full h-64 object-cover" />
              </div>
              <div className="flex gap-3 mt-4">
                {post.images.map((img, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border-2 border-white/40">
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center text-slate-400">+</div>
              </div>

              <div className="mt-6 p-4 bg-white/40 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-700">Match Confidence</h3>
                <p className="text-xs text-slate-500 mt-1">Based on your images and description, our predicts a high likelihood of matching.</p>
                <div className="w-full bg-white/60 rounded-full h-3 mt-3 overflow-hidden">
                  <div className="h-3 bg-blue-600" style={{ width: `${post.confidence}%` }} />
                </div>
                <div className="text-xs text-slate-600 text-right mt-1">{post.confidence}%</div>
              </div>
            </div>

            <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[20px] border border-white/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{post.category}</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{post.title}</h2>
                </div>
                <button className="text-slate-400 hover:text-slate-600">✎</button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">DATE & TIME LOST</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{post.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">SERIAL NUMBER</p>
                  <p className="mt-1 text-sm font-medium text-slate-800"># {post.serial}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-500">DISTINCTIVE IDENTIFIERS</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {post.identifiers.map((i, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">{i}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-500">DETAILED DESCRIPTION</p>
                <div className="mt-2 p-4 bg-white/50 rounded-lg text-sm text-slate-700">{post.description}</div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-500">LAST SEEN LOCATION</p>
                <p className="mt-1 text-sm text-blue-600">{post.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewPost;
