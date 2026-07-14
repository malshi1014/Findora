import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";


function ReportFoundItem() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [foundDate, setFoundDate] = useState("");

  const [timeFrom, setTimeFrom] = useState("");
  const [timeFromPeriod, setTimeFromPeriod] = useState("AM");
  const [timeTo, setTimeTo] = useState("");
  const [timeToPeriod, setTimeToPeriod] = useState("AM");

  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validatePhone = (phone) => {
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  const validateManualTime = (time) => {
    if (!time.trim()) return true;

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
    return timeRegex.test(time.trim());
  };

  const formatManualTime = (time, period) => {
    if (!time.trim()) return "";

    const trimmedTime = time.trim();

    if (!validateManualTime(trimmedTime)) {
      throw new Error("Please enter time in correct format. Example: 02:30");
    }

    const [hour, minute] = trimmedTime.split(":");
    const formattedHour = hour.padStart(2, "0");

    return `${formattedHour}:${minute} ${period}`;
  };

  // Client-side report validation.
  const validateForm = () => {
    const errors = {};

    if (!title.trim()) errors.title = "Report title is required";
    if (!category.trim()) errors.category = "Item category is required";
    if (!district.trim()) errors.district = "District is required";
    if (!location.trim()) errors.location = "Found location is required";

    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!validatePhone(contactNumber)) {
      errors.contactNumber = "Invalid phone number format";
    }

    if (!foundDate) errors.foundDate = "Found date is required";

    if (timeFrom && !validateManualTime(timeFrom)) {
      errors.timeFrom = "Use format --:--. Example: 02:30";
    }

    if (timeTo && !validateManualTime(timeTo)) {
      errors.timeTo = "Use format --:--. Example: 03:45";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTimeInput = (value, setter) => {
    let cleanedValue = value.replace(/[^0-9:]/g, "");

    if (cleanedValue.length > 5) {
      cleanedValue = cleanedValue.slice(0, 5);
    }

    setter(cleanedValue);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = JSON.parse(localStorage.getItem("findora_user"));

    if (!user) {
      setError("Please login before submitting a report.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    // Handle submission and upload errors.
    try {
      const fromTimeAMPM = formatManualTime(timeFrom, timeFromPeriod);
      const toTimeAMPM = formatManualTime(timeTo, timeToPeriod);

      const foundTime =
        fromTimeAMPM && toTimeAMPM
          ? `${fromTimeAMPM} - ${toTimeAMPM}`
          : fromTimeAMPM
          ? fromTimeAMPM
          : toTimeAMPM
          ? toTimeAMPM
          : "";

      const formData = new FormData();

      formData.append("user_id", user.user_id);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("district", district);
      formData.append("location", location);
      formData.append("contact_no", contactNumber);
      formData.append("found_date", foundDate);
      formData.append("found_time", foundTime);
      formData.append("unique_identifiers", keywords);
      formData.append("description", description);

      files.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/reports/add_found_report.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      console.log("Raw found report response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Found report response:", data);

      if (data.status === "success") {
        alert("Found report submitted successfully!");
        navigate("/user-dashboard/my-reports");
      } else {
        setError(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to submit report."
        );

        console.log("Missing fields:", data.missing_fields);
      }
    } catch (err) {
      console.error("Report submission error:", err);
      setError(
        err.message || "Backend connection failed. Please check Apache and MySQL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleBasedLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl bg-gradient-to-r from-slate-100 via-white to-slate-100 p-8 shadow-2xl shadow-slate-300/20 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Report Submission
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                Report Found Item
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Provide details about the item you found so we can help locate
                the owner. Adding photos and identifying marks increases the
                chance of a reunion.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm shadow-slate-200">
              <div className="w-10 h-10 flex items-center justify-center">
              <img
                  src="/favicon.png"
                  alt="Findora Logo"
                  className="h-full w-full rounded-full object-cover"
                />
            </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">Findora</p>
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
                <span className="text-sm font-semibold text-slate-700">
                  Report Title <span className="text-red-500">*</span>
                </span>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: Found black iPhone 11"
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.title ? "border-red-400" : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />

                {fieldErrors.title && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.title}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Item Category <span className="text-red-500">*</span>
                </span>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.category
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Pet">Pet</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
                </select>

                {fieldErrors.category && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.category}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  District <span className="text-red-500">*</span>
                </span>

                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Example: Badulla"
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.district
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />

                {fieldErrors.district && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.district}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Found Location <span className="text-red-500">*</span>
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was it found?"
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.location
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />

                {fieldErrors.location && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.location}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Contact Number <span className="text-red-500">*</span>
                </span>

                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+94 xx xxxx xxx"
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.contactNumber
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />

                {fieldErrors.contactNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.contactNumber}
                  </p>
                )}
              </label>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.35fr_0.7fr_0.35fr]">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Found Date <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="date"
                    value={foundDate}
                    onChange={(e) => setFoundDate(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.foundDate
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />

                  {fieldErrors.foundDate && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.foundDate}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Time From
                  </span>

                  <input
                    type="text"
                    value={timeFrom}
                    onChange={(e) =>
                      handleTimeInput(e.target.value, setTimeFrom)
                    }
                    placeholder="--:--"
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.timeFrom
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />

                  {fieldErrors.timeFrom && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.timeFrom}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    AM/PM
                  </span>

                  <select
                    value={timeFromPeriod}
                    onChange={(e) => setTimeFromPeriod(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Time To
                  </span>

                  <input
                    type="text"
                    value={timeTo}
                    onChange={(e) =>
                      handleTimeInput(e.target.value, setTimeTo)
                    }
                    placeholder="--:--"
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.timeTo
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />

                  {fieldErrors.timeTo && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.timeTo}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    AM/PM
                  </span>

                  <select
                    value={timeToPeriod}
                    onChange={(e) => setTimeToPeriod(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Unique Identifiers / Keywords
                </span>

                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  rows="3"
                  placeholder="Serial number, stickers, specific scratches, engravings, etc."
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Detailed Description <span className="text-red-500">*</span>
                </span>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Provide details about the item's condition, unique marks, etc."
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.description
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />

                {fieldErrors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.description}
                  </p>
                )}
              </label>
            </div>

            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-100 p-8 text-center text-slate-600">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-3xl text-blue-600">
                ⬆️
              </div>

              <p className="text-sm font-semibold text-slate-950">
                Upload Images
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Supports png, jpg, jpeg, webp. Click to browse.
              </p>

              <input
                id="found-images"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
              />

              <label
                htmlFor="found-images"
                className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Choose Files
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
    </RoleBasedLayout>
  );
}

export default ReportFoundItem;
