import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { reportService, uploadService } from "../../services/api";

function ReportFoundItem() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
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
  const [fieldErrors, setFieldErrors] = useState({});

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!category.trim()) errors.category = "Item category is required";
    if (!location.trim()) errors.location = "Found location is required";
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!validatePhone(contactNumber)) {
      errors.contactNumber = "Invalid phone number format";
    }
    if (!foundDate) errors.foundDate = "Found date is required";
    if (!description.trim()) errors.description = "Description is required";
    if (description.trim().length < 10) errors.description = "Description must be at least 10 characters";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

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
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl bg-linear-to-r from-slate-100 via-white to-slate-100 p-8 shadow-2xl shadow-slate-300/20 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Report Submission
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                Report Found Item
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Provide details about the item you found so we can help locate the owner.
                Adding photos and identifying marks increases the chance of a reunion.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm shadow-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                D
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                <p className="text-sm text-slate-500">Report Found Item</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-xl shadow-slate-300/10 ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-4xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Item Category <span className="text-red-500">*</span></span>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.category ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Pet">Pet</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Found Location <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was it found?"
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.location ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.location && <p className="mt-1 text-xs text-red-600">{fieldErrors.location}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Contact Number <span className="text-red-500">*</span></span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+94 xx xxxx xxx"
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.contactNumber ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.contactNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.contactNumber}</p>}
              </label>

              <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] xl:grid-cols-[1.2fr_0.4fr_0.4fr]">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Found Date <span className="text-red-500">*</span></span>
                  <input
                    type="date"
                    value={foundDate}
                    onChange={(e) => setFoundDate(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${fieldErrors.foundDate ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.foundDate && <p className="mt-1 text-xs text-red-600">{fieldErrors.foundDate}</p>}
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Found Time Range</span>
                  <input
                    type="text"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    placeholder="From"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">&nbsp;</span>
                  <input
                    type="text"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    placeholder="To"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Unique Identifiers / Keywords</span>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  rows="3"
                  placeholder="Serial number, stickers, specific scratches, engravings, etc."
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Detailed Description <span className="text-red-500">*</span></span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Provide details about the item's condition, unique marks, etc."
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.description ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
              </label>
            </div>

            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-100 p-8 text-center text-slate-600">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-3xl text-blue-600">
                ⬆️
              </div>
              <p className="text-sm font-semibold text-slate-950">Upload Images</p>
              <p className="mt-2 text-sm text-slate-500">Supports png, jpg, jpeg. Drag & drop or click to browse.</p>
              <label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
                />
                <button
                  type="button"
                  onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Choose Files
                </button>
              </label>
              {files.length > 0 && (
                <p className="mt-3 text-sm text-slate-700">
                  {files.length} file(s) selected
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ReportFoundItem;
