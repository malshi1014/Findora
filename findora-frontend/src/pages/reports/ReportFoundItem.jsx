import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { reportService, uploadService } from "../../services/api";

function ReportFoundItem() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category || !location || !contactNumber || !foundDate || !description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      let imageUrls = [];

      if (files.length > 0) {
        const uploadResponse = await uploadService.uploadReportImages(files);
        imageUrls = uploadResponse.imageUrls || [];
      }

      const reportPayload = {
        category,
        location,
        contactNumber,
        foundDate,
        timeRange: { from: timeFrom, to: timeTo },
        keywords,
        description,
        images: imageUrls,
      };

      await reportService.createFoundItemReport(reportPayload);
      alert("Report submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to submit report. Please try again.");
      console.error("Report submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #7ec0fc 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <h1 className="text-3xl font-bold text-slate-950">Report Found Item</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Found something that doesn&apos;t belong to you? Let our community know and help reunite it with its owner.</p>
            </div>

            <div className="p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <form onSubmit={handleSubmit} className="space-y-9">
                {error && <div className="rounded-2xl bg-red-50/90 backdrop-blur p-4 text-sm text-red-600 border border-red-200">{error}</div>}

                <div className="grid gap-8">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Report Title</span>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your report a title"
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <div className="grid gap-8 lg:grid-cols-3">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Item Category</span>
                      <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Pet">Pet</option>
                        <option value="Documents">Documents</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Found Location</span>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where did you find it?"
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Contact Number</span>
                      <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+94 xx xxxx xxx"
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] xl:grid-cols-[1.2fr_0.4fr_0.4fr]">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Found Date</span>
                      <input type="date" value={foundDate} onChange={(e) => setFoundDate(e.target.value)}
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Found Time Range</span>
                      <input type="text" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} placeholder="From"
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">&nbsp;</span>
                      <input type="text" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} placeholder="To"
                        className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Unique Identifiers / Keywords</span>
                    <textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} rows="3" placeholder="Serial number, stickers, specific scratches, engravings, etc."
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Detailed Description</span>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" placeholder="Provide details about the item's condition, unique marks, etc."
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>

                <div className="rounded-[2rem] border-2 border-dashed border-blue-300/40 bg-white/20 backdrop-blur p-8 text-center text-slate-600">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-950">Upload Images</p>
                  <p className="mt-2 text-sm text-slate-500">Supports png, jpg, jpeg. Drag & drop or click to browse.</p>
                  <label>
                    <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/png,image/jpeg,image/jpg" />
                    <button type="button" onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                      className="mt-5 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Choose Files</button>
                  </label>
                  {files.length > 0 && <p className="mt-3 text-sm text-slate-700 font-medium">{files.length} file(s) selected</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ReportFoundItem;
