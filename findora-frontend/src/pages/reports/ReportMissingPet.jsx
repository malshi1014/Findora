import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { reportService, uploadService } from "../../services/api";

function ReportMissingPet() {
  const navigate = useNavigate();
  const [petType, setPetType] = useState("");
  const [petName, setPetName] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [lostDate, setLostDate] = useState("");
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
    
    if (!petType) errors.petType = "Pet type is required";
    if (!petName.trim()) errors.petName = "Pet name is required";
    if (!location.trim()) errors.location = "Lost location is required";
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!validatePhone(contactNumber)) {
      errors.contactNumber = "Invalid phone number format";
    }
    if (!lostDate) errors.lostDate = "Lost date is required";
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
        petType,
        petName,
        location,
        contactNumber,
        lostDate,
        timeRange: { from: timeFrom, to: timeTo },
        keywords,
        description,
        images: imageUrls,
      };

      await reportService.createMissingPetReport(reportPayload);
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
                Report Missing pets
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Share details about the missing pet so the community can help locate them.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm shadow-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                D
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                <p className="text-sm text-slate-500">Report Missing pets</p>
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
                <span className="text-sm font-semibold text-slate-700">Pet Category <span className="text-red-500">*</span></span>
                <select 
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.petType ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                >
                  <option value="">Select Pet Type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.petType && <p className="mt-1 text-xs text-red-600">{fieldErrors.petType}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Pet Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Pet's name"
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.petName ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.petName && <p className="mt-1 text-xs text-red-600">{fieldErrors.petName}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Lost Location <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was it last seen?"
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
                  <span className="text-sm font-semibold text-slate-700">Lost Date <span className="text-red-500">*</span></span>
                  <input
                    type="date"
                    value={lostDate}
                    onChange={(e) => setLostDate(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${fieldErrors.lostDate ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.lostDate && <p className="mt-1 text-xs text-red-600">{fieldErrors.lostDate}</p>}
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Lost Time Range</span>
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
                  placeholder="e.g. microchip number, collar tag, distinguishing marks"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Detailed Description <span className="text-red-500">*</span></span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Provide details about the pet's appearance, behaviour, and last seen circumstances"
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.description ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
              </label>
            </div>

            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-100 p-8 text-center text-slate-600">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-3xl text-blue-600">
                ⬆️
              </div>
              <p className="text-sm font-semibold text-slate-950">Upload Images (supports png, jpg, jpeg)</p>
              <p className="mt-2 text-sm text-slate-500">Drag & drop or click to browse.</p>
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

export default ReportMissingPet;