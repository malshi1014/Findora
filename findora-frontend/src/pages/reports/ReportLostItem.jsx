import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import TownSelect from "../../components/TownSelect";
import { getMaxDate, validateNotFuture } from "../../utils/dateValidation";

function ReportLostItem() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [nearestTown, setNearestTown] = useState("");
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

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const formatToAMPM = (time) => {
    if (!time) return "";

    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = JSON.parse(localStorage.getItem("findora_user"));

    // Require an authenticated user.
    if (!user) {
      setError("Please login before submitting a report.");
      return;
    }

    // Client-side report validation.
    if (
      !title ||
      !category ||
      !nearestTown ||
      !location ||
      !contactNumber ||
      !lostDate ||
      !description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const futureDateError = validateNotFuture(lostDate, timeFrom) || validateNotFuture(lostDate, timeTo);
    if (futureDateError) {
      setError("Date and time cannot be in the future.");
      return;
    }

    setLoading(true);

    // Handle submission and upload errors.
    try {
      const fromTimeAMPM = formatToAMPM(timeFrom);
      const toTimeAMPM = formatToAMPM(timeTo);

      const lostTime =
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
      formData.append("nearest_town", nearestTown);
      formData.append("location", location);
      formData.append("contact_no", contactNumber);
      formData.append("lost_date", lostDate);
      formData.append("lost_time", lostTime);
      formData.append("unique_identifiers", keywords);
      formData.append("description", description);

      files.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/reports/add_lost_report.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      console.log("Raw lost report response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Lost report response:", data);

      if (data.status === "success") {
        alert("Lost report submitted successfully!");
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
                Report Lost Item
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Share the details of your lost item so our community can help
                you recover it quickly. The more information you provide, the
                better the match results.
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
                <p className="text-sm text-slate-500">Report Lost Item</p>
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
                  Report Title
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: Lost black iPhone 11"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Item Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Pet">Pet</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 block mb-3">
                  Nearest Town
                </span>
                <TownSelect 
                  value={nearestTown}
                  onChange={setNearestTown}
                  hasIcon={false}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Lost Location
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was it last seen?"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Contact Number
                </span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+94 xx xxxx xxx"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] xl:grid-cols-[1.2fr_0.4fr_0.4fr]">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Lost Date
                  </span>
                  <input
                    type="date"
                    value={lostDate}
                    max={getMaxDate()}
                    onChange={(e) => setLostDate(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Lost Time From
                  </span>
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Lost Time To
                  </span>
                  <input
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
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
                  Detailed Description
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Provide details about the item's condition, unique marks, etc."
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
                id="lost-images"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
              />

              <label
                htmlFor="lost-images"
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

export default ReportLostItem;
