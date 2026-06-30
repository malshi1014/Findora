import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Sony WH-1000XM4 Headphones");
  const [category, setCategory] = useState("Electronics");
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("Central Park Cafe, Downtown");
  const [contact, setContact] = useState("+94 77 123 4567");
  const [lostDate, setLostDate] = useState("2023-10-24");
  const [timeFrom, setTimeFrom] = useState("14:00");
  const [timeTo, setTimeTo] = useState("16:30");
  const [keywords, setKeywords] = useState("Sony, WH-1000XM4, black, noise-canceling, carrying case");
  const [description, setDescription] = useState("Black noise-canceling headphones in a black carrying case. There's a small scratch on the right earcup. Last seen near the counter at Central Park Cafe.");
  const [existingImages] = useState([1, 2, 3]);
  const [newFiles, setNewFiles] = useState([]);

  const charsUsed = description.length;

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { id, title, category, type, location, contact, lostDate, timeFrom, timeTo, keywords, description };
    console.log("update payload", payload);
    alert("Changes saved successfully!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently delete this report? This action cannot be undone.")) {
      alert("Report deleted successfully.");
      navigate("/my-posts");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #7ec0fc 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <h1 className="text-3xl font-bold text-slate-950">Edit Report</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Update the details below. Changes will be saved to your report and visible to the community.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">

              <div className="space-y-8">
                <div className="p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                  <form onSubmit={handleSave} className="space-y-7">

                    <div className="grid gap-7">
                      <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr_0.8fr]">
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Report Title</span>
                          <input value={title} onChange={(e) => setTitle(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Category</span>
                          <select value={category} onChange={(e) => setCategory(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                            <option>Electronics</option>
                            <option>Jewelry</option>
                            <option>Pet</option>
                            <option>Documents</option>
                            <option>Other</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Type</span>
                          <select value={type} onChange={(e) => setType(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                            <option>Lost</option>
                            <option>Found</option>
                          </select>
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Location</span>
                          <input value={location} onChange={(e) => setLocation(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Contact Number</span>
                          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+94 xx xxxx xxx"
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.4fr_0.4fr]">
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Lost Date</span>
                          <input type="date" value={lostDate} onChange={(e) => setLostDate(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">From</span>
                          <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">To</span>
                          <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Keywords</span>
                        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Serial number, stickers, specific scratches, engravings, etc."
                          className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      </label>

                      <label className="block">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">Description</span>
                          <span className="text-xs text-slate-400">{charsUsed} chars</span>
                        </div>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                          className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
                      </label>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Current Images</p>
                      <div className="flex flex-wrap gap-3">
                        {existingImages.map((img) => (
                          <div key={img} className="relative w-24 h-24 rounded-xl bg-white/40 backdrop-blur border border-white/40 flex items-center justify-center group">
                            <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z" /><path d="M22 15L17 10L5 22" />
                            </svg>
                            <button className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">&times;</button>
                          </div>
                        ))}
                        <label className="w-24 h-24 rounded-xl border-2 border-dashed border-blue-300/40 bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                          <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5V19" /><path d="M5 12H19" /></svg>
                          <input type="file" className="hidden" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))} />
                        </label>
                      </div>
                      {newFiles.length > 0 && <p className="mt-2 text-xs text-slate-500">{newFiles.length} new file(s) selected</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button type="submit"
                        className="flex-1 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                        Save Changes
                      </button>
                      <button type="button" onClick={() => navigate("/my-posts")}
                        className="flex-1 rounded-full bg-white/40 backdrop-blur border border-white/40 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white/60">
                        Cancel
                      </button>
                    </div>

                    <button type="button" onClick={handleDelete}
                      className="w-full rounded-full border-2 border-red-300/40 bg-red-500/10 px-6 py-3.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20 hover:-translate-y-0.5">
                      Delete Report
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Report Status</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-lg font-bold text-slate-900">Active Search</p>
                  </div>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <p className="text-slate-500">Report ID</p>
                      <p className="font-semibold text-slate-800">#{id}</p>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <p className="text-slate-500">Created</p>
                      <p className="font-semibold text-slate-800">Oct 03, 2023</p>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <p className="text-slate-500">Last Updated</p>
                      <p className="font-semibold text-slate-800">Today</p>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <p className="text-slate-500">Views</p>
                      <p className="font-semibold text-slate-800">145</p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-slate-500">Matches</p>
                      <p className="font-semibold text-slate-800">2</p>
                    </div>
                  </div>
                  <button className="mt-6 w-full rounded-2xl bg-white/40 backdrop-blur border border-white/40 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white/60 hover:scale-[1.02]">
                    View Public Report
                  </button>
                </div>

                <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Activity Log</p>
                  <div className="space-y-4">
                    {[
                      { action: "Report created", time: "Oct 03, 2023" },
                      { action: "1st match found", time: "Oct 15, 2023" },
                      { action: "2nd match found", time: "Oct 22, 2023" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{log.action}</p>
                          <p className="text-xs text-slate-400">{log.time}</p>
                        </div>
                      </div>
                    ))}
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

export default EditReport;
