import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { reportService, uploadService } from "../../services/api";

function ReportMissingPerson() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [lastSeenDate, setLastSeenDate] = useState("");
  const [distinguishingMarks, setDistinguishingMarks] = useState("");
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
    
    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!age || age < 0 || age > 150) errors.age = "Please enter a valid age";
    if (!gender) errors.gender = "Gender is required";
    if (!lastSeen.trim()) errors.lastSeen = "Last seen location is required";
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!validatePhone(contactNumber)) {
      errors.contactNumber = "Invalid phone number format";
    }
    if (!lastSeenDate) errors.lastSeenDate = "Last seen date is required";
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
        fullName,
        age,
        gender,
        lastSeen,
        contactNumber,
        lastSeenDate,
        distinguishingMarks,
        description,
        images: imageUrls,
      };

      await reportService.createMissingPersonReport(reportPayload);
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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Report Submission</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">Report Missing Person</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Provide details about the missing person to help the community locate them.
                Include photos, distinguishing marks, and any contextual information.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm shadow-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">D</div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                <p className="text-sm text-slate-500">Report Missing Person</p>
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
                <span className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></span>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name" 
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.fullName ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.fullName && <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>}
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Age <span className="text-red-500">*</span></span>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0" 
                    max="150"
                    placeholder="Age" 
                    className={`mt-3 w-full rounded-3xl border ${fieldErrors.age ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.age && <p className="mt-1 text-xs text-red-600">{fieldErrors.age}</p>}
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Gender <span className="text-red-500">*</span></span>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${fieldErrors.gender ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.gender && <p className="mt-1 text-xs text-red-600">{fieldErrors.gender}</p>}
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
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Last Seen Location <span className="text-red-500">*</span></span>
                <input 
                  type="text" 
                  value={lastSeen}
                  onChange={(e) => setLastSeen(e.target.value)}
                  placeholder="Where were they last seen?" 
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.lastSeen ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.lastSeen && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastSeen}</p>}
              </label>

              <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Missing Date <span className="text-red-500">*</span></span>
                  <input 
                    type="date" 
                    value={lastSeenDate}
                    onChange={(e) => setLastSeenDate(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${fieldErrors.lastSeenDate ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.lastSeenDate && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastSeenDate}</p>}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Distinguishing Marks</span>
                <textarea 
                  value={distinguishingMarks}
                  onChange={(e) => setDistinguishingMarks(e.target.value)}
                  rows="3" 
                  placeholder="Tattoos, scars, unique features, clothing worn, etc." 
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Detailed Description <span className="text-red-500">*</span></span>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4" 
                  placeholder="Provide details about circumstances of disappearance, behavior, mental state, etc." 
                  className={`mt-3 w-full rounded-3xl border ${fieldErrors.description ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
              </label>
            </div>

            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-100 p-8 text-center text-slate-600">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-3xl text-blue-600">
                ⬆️
              </div>
              <p className="text-sm font-semibold text-slate-950">Upload Photos</p>
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

export default ReportMissingPerson;
