import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function ReportSuspiciousItem() {
  const navigate = useNavigate();
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details || !location || !contact) {
      setError("Please complete all fields before submitting.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Suspicious activity report submitted.");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">Report Submission</span>
                  <h1 className="mt-4 text-3xl font-bold text-slate-950">Report Suspicious Item</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Notify the team about suspicious items or behavior so we can investigate and protect the community.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/40 backdrop-blur px-4 py-3 shadow-sm shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white text-lg font-bold">D</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                    <p className="text-sm text-slate-500">Report Suspicious Item</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <form onSubmit={handleSubmit} className="space-y-9">
                {error && <div className="rounded-2xl bg-red-50/90 backdrop-blur p-4 text-sm text-red-600 border border-red-200">{error}</div>}

                <div className="grid gap-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Item Category</span>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                        <option value="">Category (Dropdown)</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="documents">Documents</option>
                        <option value="other">Other</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Shop Location</span>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where was it last seen?"
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Contact Number</span>
                      <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+94 xx xxxx xxxx"
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Found Date</span>
                      <input type="date" value={foundDate} onChange={(e) => setFoundDate(e.target.value)}
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Found Time From</span>
                        <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)}
                          className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Found Time To</span>
                        <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)}
                          className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      </label>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Unique Identifiers / Keywords</span>
                    <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Serial number, stickers, specific scratches, engravings, etc."
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Detailed Description</span>
                    <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} placeholder="Provide details about the item's condition, unique marks, etc."
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>

                  <div>
                    <span className="text-sm font-semibold text-slate-700">Upload Images (supports png, jpg, jpeg)</span>
                    <div className="mt-3">
                      <label className="block rounded-2xl border-dashed border-2 border-white/40 bg-[#dff3ff]/60 p-6 text-center cursor-pointer">
                        <input type="file" accept="image/*" multiple onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setImages((prev) => prev.concat(files));
                        }} className="hidden" />
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-500">
                            <path d="M12 4v12" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 8l4-4 4 4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="text-sm text-slate-600">Drag & Drop box</p>
                        </div>
                      </label>

                      {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-4 gap-3">
                          {images.map((file, idx) => (
                            <div key={idx} className="h-24 w-24 rounded-xl overflow-hidden border border-white/30 bg-white/20 flex items-center justify-center text-xs text-slate-700">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-[12px] bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ReportSuspiciousItem;
