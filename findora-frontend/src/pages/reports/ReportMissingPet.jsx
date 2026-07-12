import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";

function ReportMissingPet() {
  const navigate = useNavigate();

  const [petCategory, setPetCategory] = useState("");
  const [petName, setPetName] = useState("");
  const [district, setDistrict] = useState("");
  const [nearestTown, setNearestTown] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [guardianContactNo, setGuardianContactNo] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [lostTime, setLostTime] = useState("");
  const [lostTimePeriod, setLostTimePeriod] = useState("AM");
  const [uniqueIdentifiers, setUniqueIdentifiers] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("findora_user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    return phoneRegex.test(phone);
  };

  const validateManualTime = (time) => {
    if (!time.trim()) {
      return true;
    }

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
    return timeRegex.test(time.trim());
  };

  const formatManualTime = () => {
    if (!lostTime.trim()) {
      return "";
    }

    if (!validateManualTime(lostTime)) {
      throw new Error("Please enter lost time in correct format. Example: 02:30");
    }

    const [hour, minute] = lostTime.trim().split(":");
    return `${hour.padStart(2, "0")}:${minute} ${lostTimePeriod}`;
  };

  const handleTimeInput = (value) => {
    const cleanedValue = value.replace(/[^0-9:]/g, "");
    setLostTime(cleanedValue.slice(0, 5));
  };

  const validateForm = () => {
    const errors = {};

    if (!petCategory) errors.petCategory = "Pet category is required.";
    if (!petName.trim()) errors.petName = "Pet name is required.";
    if (!district.trim()) errors.district = "District is required.";
    if (!nearestTown.trim()) errors.nearestTown = "Nearest town is required.";
    if (!lastSeenLocation.trim()) {
      errors.lastSeenLocation = "Last seen location is required.";
    }
    if (!guardianContactNo.trim()) {
      errors.guardianContactNo = "Guardian contact number is required.";
    } else if (!validatePhone(guardianContactNo)) {
      errors.guardianContactNo = "Invalid contact number.";
    }
    if (!lostDate) errors.lostDate = "Lost date is required.";
    if (lostTime.trim() && !validateManualTime(lostTime)) {
      errors.lostTime = "Use time format like 02:30.";
    }
    if (!description.trim()) {
      errors.description = "Description is required.";
    } else if (description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = getCurrentUser();

    if (!user) {
      alert("Please login first to submit a missing pet report.");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formattedLostTime = formatManualTime();

      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("pet_name", petName);
      formData.append("pet_category", petCategory);
      formData.append("description", description);
      formData.append("unique_identifiers", uniqueIdentifiers);
      formData.append("lost_date", lostDate);
      formData.append("lost_time", formattedLostTime);
      formData.append("district", district);
      formData.append("nearest_town", nearestTown);
      formData.append("last_seen_location", lastSeenLocation);
      formData.append("guardian_contact_no", guardianContactNo);

      files.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/reports/add_missing_pet_post.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      console.log("Raw missing pet response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      if (data.status === "success") {
        alert(
          "Missing pet report submitted successfully. It is pending admin approval."
        );
        navigate("/user-dashboard/my-reports");
      } else {
        setError(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to submit missing pet report."
        );
      }
    } catch (err) {
      console.error("Missing pet submission error:", err);
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
                Report Missing Pet
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Share accurate location, time, photos and identifying details so
                the community can help find your pet quickly.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm shadow-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                🐾
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Missing Pet
                </p>
                <p className="text-sm text-slate-500">Pending admin approval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-xl shadow-slate-300/10 ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-4xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Pet Category <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={petCategory}
                    onChange={(e) => setPetCategory(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.petCategory
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  >
                    <option value="">Select Pet Type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.petCategory && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.petCategory}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Pet Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Example: Rocky"
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.petName
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.petName && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.petName}
                    </p>
                  )}
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                    Nearest Town <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={nearestTown}
                    onChange={(e) => setNearestTown(e.target.value)}
                    placeholder="Example: Badulla Town"
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.nearestTown
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.nearestTown && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.nearestTown}
                    </p>
                  )}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Last Seen Location <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={lastSeenLocation}
                  onChange={(e) => setLastSeenLocation(e.target.value)}
                  placeholder="Example: Near UWU main gate, Badulla"
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.lastSeenLocation
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.lastSeenLocation && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.lastSeenLocation}
                  </p>
                )}
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Lost Date <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="date"
                    value={lostDate}
                    onChange={(e) => setLostDate(e.target.value)}
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.lostDate
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.lostDate && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.lostDate}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Lost Time
                  </span>
                  <input
                    type="text"
                    value={lostTime}
                    onChange={(e) => handleTimeInput(e.target.value)}
                    placeholder="--:--"
                    className={`mt-3 w-full rounded-3xl border ${
                      fieldErrors.lostTime
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  {fieldErrors.lostTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.lostTime}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    AM / PM
                  </span>
                  <select
                    value={lostTimePeriod}
                    onChange={(e) => setLostTimePeriod(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Guardian's Contact Number{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  type="tel"
                  value={guardianContactNo}
                  onChange={(e) => setGuardianContactNo(e.target.value)}
                  placeholder="Example: 0771234567"
                  className={`mt-3 w-full rounded-3xl border ${
                    fieldErrors.guardianContactNo
                      ? "border-red-400"
                      : "border-slate-200"
                  } bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
                {fieldErrors.guardianContactNo && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.guardianContactNo}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Unique Identifiers
                </span>
                <textarea
                  value={uniqueIdentifiers}
                  onChange={(e) => setUniqueIdentifiers(e.target.value)}
                  rows="3"
                  placeholder="Example: blue collar, white patch on forehead, microchip number, injured back leg"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  placeholder="Add details like breed, pet colours, size, behaviour, last seen situation and any other important information."
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
                Upload Pet Images
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Supports png, jpg, jpeg and webp.
              </p>

              <label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                />

                <button
                  type="button"
                  onClick={(e) =>
                    e.currentTarget.parentElement
                      .querySelector("input")
                      .click()
                  }
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
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Missing Pet Report"}
            </button>
          </form>
        </div>
      </div>
    </RoleBasedLayout>
  );
}

export default ReportMissingPet;