import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";
import { getMaxDate, validateNotFuture } from "../../utils/dateValidation";

function EditReport() {
  const navigate = useNavigate();
  const { reportType, reportId } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [nearestTown, setNearestTown] = useState("");
  const [location, setLocation] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [contact, setContact] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [timeFrom, setTimeFrom] = useState("");
  const [timeFromPeriod, setTimeFromPeriod] = useState("AM");
  const [timeTo, setTimeTo] = useState("");
  const [timeToPeriod, setTimeToPeriod] = useState("AM");

  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("findora_user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const validateManualTime = (time) => {
    if (!time.trim()) return true;

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
    return timeRegex.test(time.trim());
  };

  const handleTimeInput = (value, setter) => {
    let cleanedValue = value.replace(/[^0-9:]/g, "");

    if (cleanedValue.length > 5) {
      cleanedValue = cleanedValue.slice(0, 5);
    }

    setter(cleanedValue);
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

  const convert24HourTo12Hour = (time) => {
    if (!time) return { time: "", period: "AM" };

    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    if (Number.isNaN(hour)) {
      return { time: "", period: "AM" };
    }

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;

    return {
      time: `${String(hour).padStart(2, "0")}:${minute}`,
      period,
    };
  };

  const parseTimePart = (timePart) => {
    if (!timePart) return { time: "", period: "AM" };

    const trimmed = timePart.trim();

    const ampmMatch = trimmed.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);

    if (ampmMatch) {
      const time = ampmMatch[1];
      const period = ampmMatch[2].toUpperCase();

      const [hour, minute] = time.split(":");

      return {
        time: `${hour.padStart(2, "0")}:${minute}`,
        period,
      };
    }

    const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):([0-5][0-9])$/);

    if (twentyFourHourMatch) {
      return convert24HourTo12Hour(trimmed);
    }

    return { time: "", period: "AM" };
  };

  const parseReportTime = (reportTime) => {
    if (!reportTime) return;

    const parts = reportTime.split(" - ");

    const from = parseTimePart(parts[0]);
    const to = parseTimePart(parts[1]);

    setTimeFrom(from.time);
    setTimeFromPeriod(from.period);

    setTimeTo(to.time);
    setTimeToPeriod(to.period);
  };

  const fetchReport = async () => {
    const user = getCurrentUser();

    if (!user) {
      setError("Please login to edit your report.");
      setLoading(false);
      return;
    }

    if (!["lost", "found", "missing_pet", "missing_person"].includes(reportType)) {
      setError("Invalid report type.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/reports/get_single_report.php?user_id=${user.user_id}&report_id=${reportId}&report_type=${reportType}&type=${reportType}&id=${reportId}`
      );

      const data = await response.json();

      if (data.status === "success" && data.report) {
        const item = data.report;

        setTitle(item.title || item.pet_name || item.full_name || "");
        setCategory(
          item.category ||
            item.pet_category ||
            (reportType === "missing_person" ? "Missing Person" : "")
        );
        setDistrict(item.district || "");
        setNearestTown(item.nearest_town || "");
        setLocation(item.location || item.last_seen_location || "");
        setLastSeenLocation(item.last_seen_location || item.location || "");
        setContact(item.contact_no || item.guardian_contact_no || "");
        setReportDate(
          item.report_date || item.found_date || item.lost_date || item.missing_date || ""
        );
        setKeywords(item.unique_identifiers || item.distinguishing_marks || "");
        setDescription(item.description || "");
        setAge(item.age || "");
        setGender(item.gender || "");
        setStatus(item.status || "Pending");
        setCreatedAt(item.created_at || "");

        parseReportTime(
          item.report_time || item.found_time || item.lost_time || item.missing_time || ""
        );
      } else {
        setError(data.message || "Report not found.");
      }
    } catch (err) {
      console.error("Fetch report error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_single_report.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, reportId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const user = getCurrentUser();

    if (!user) {
      setError("Please login again.");
      return;
    }

    if (
      !title ||
      !category ||
      !district ||
      (!location && !lastSeenLocation) ||
      !contact ||
      !reportDate ||
      !description
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!validateManualTime(timeFrom)) {
      setError("Time From must be in correct format. Example: 02:30");
      return;
    }

    if (!validateManualTime(timeTo)) {
      setError("Time To must be in correct format. Example: 03:45");
      return;
    }

    const futureErr =
      validateNotFuture(reportDate, timeFrom, timeFromPeriod) ||
      validateNotFuture(reportDate, timeTo, timeToPeriod);
    if (futureErr) {
      setError("Date and time cannot be in the future.");
      return;
    }

    setSaving(true);

    try {
      const fromTimeAMPM = formatManualTime(timeFrom, timeFromPeriod);
      const toTimeAMPM = formatManualTime(timeTo, timeToPeriod);

      const reportTime =
        fromTimeAMPM && toTimeAMPM
          ? `${fromTimeAMPM} - ${toTimeAMPM}`
          : fromTimeAMPM
          ? fromTimeAMPM
          : toTimeAMPM
          ? toTimeAMPM
          : "";

      const response = await fetch(`${API_BASE_URL}/reports/update_report.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          report_id: reportId,
          report_type: reportType,
          title,
          category,
          district,
          location: nearestTown || location,
          last_seen_location: lastSeenLocation || location,
          contact_no: contact,
          report_date: reportDate,
          report_time: reportTime,
          unique_identifiers: keywords,
          description,
          age,
          gender,
        }),
      });

      const text = await response.text();
      console.log("Raw update report response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Update report response:", data);

      if (data.status === "success") {
        alert("Report updated successfully!");
        const backUrl =
          user.role === "shop_owner"
            ? "/shop-owner/my-reports"
            : "/user-dashboard/my-reports";
        navigate(backUrl);
      } else {
        setError(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to update report."
        );
      }
    } catch (err) {
      console.error("Update report error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check update_report.php."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusStyle = () => {
    if (status === "matched") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const getReportTypeBadge = () => {
    if (reportType === "missing_person") return "Missing Person Report";
    if (reportType === "missing_pet") return "Missing Pet Report";
    if (reportType === "found") return "Found Report";
    return "Lost Report";
  };

  const getTitleLabel = () => {
    if (reportType === "missing_person") return "Full Name";
    if (reportType === "missing_pet") return "Pet Name";
    return "Report Title";
  };

  const getContactLabel = () => {
    if (reportType === "missing_person" || reportType === "missing_pet") {
      return "Guardian / Contact Number";
    }
    return "Contact Number";
  };

  const getDateLabel = () => {
    if (reportType === "missing_person") return "Missing Date";
    if (reportType === "missing_pet" || reportType === "lost") return "Lost Date";
    return "Found Date";
  };

  const getKeywordsLabel = () => {
    if (reportType === "missing_person") return "Distinguishing Marks / Features";
    return "Unique Identifiers / Keywords";
  };

  const user = getCurrentUser();
  const backPath =
    user?.role === "shop_owner"
      ? "/shop-owner/my-reports"
      : "/user-dashboard/my-reports";

  if (loading) {
    return (
      <RoleBasedLayout>
        <p className="p-6 text-slate-700">Loading report details...</p>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            to={backPath}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to My Reports
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-4xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                {getReportTypeBadge()}
              </p>

              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                Edit Report
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Update your report details to improve accuracy and matching results.
              </p>

              {error && (
                <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    {getTitleLabel()}
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      reportType === "missing_person"
                        ? "Person's Full Name"
                        : reportType === "missing_pet"
                        ? "Pet's Name"
                        : "Title of report"
                    }
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  {reportType === "missing_pet" ? (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Pet Category</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : reportType === "missing_person" ? (
                    <input
                      type="text"
                      value="Missing Person"
                      readOnly
                      className="mt-3 w-full cursor-not-allowed rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                    />
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Smart Phone/Mobile phone">
                        Smart Phone/Mobile phone
                      </option>
                      <option value="Laptop">Laptop</option>
                      <option value="Wallet">Wallet</option>
                      <option value="NIC/Student ID">NIC/Student ID</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Documents">Documents</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>

                {reportType === "missing_person" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        Age
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age (e.g. 25)"
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      District
                    </label>

                    <input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="District"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Nearest Town
                    </label>

                    <input
                      value={nearestTown}
                      onChange={(e) => setNearestTown(e.target.value)}
                      placeholder="Nearest Town"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    {reportType === "missing_person" || reportType === "missing_pet"
                      ? "Last Seen Location"
                      : reportType === "lost"
                      ? "Lost Location"
                      : "Found Location"}
                  </label>

                  <input
                    value={
                      reportType === "missing_person" || reportType === "missing_pet"
                        ? lastSeenLocation || location
                        : location
                    }
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setLastSeenLocation(e.target.value);
                    }}
                    placeholder="Specific location or area"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    {getContactLabel()}
                  </label>

                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Phone number"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.35fr_0.7fr_0.35fr]">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      {getDateLabel()}
                    </label>

                    <input
                      type="date"
                      value={reportDate}
                      max={getMaxDate()}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Time From
                    </label>

                    <input
                      value={timeFrom}
                      onChange={(e) =>
                        handleTimeInput(e.target.value, setTimeFrom)
                      }
                      placeholder="--:--"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      AM/PM
                    </label>

                    <select
                      value={timeFromPeriod}
                      onChange={(e) => setTimeFromPeriod(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Time To
                    </label>

                    <input
                      value={timeTo}
                      onChange={(e) =>
                        handleTimeInput(e.target.value, setTimeTo)
                      }
                      placeholder="--:--"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      AM/PM
                    </label>

                    <select
                      value={timeToPeriod}
                      onChange={(e) => setTimeToPeriod(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    {getKeywordsLabel()}
                  </label>

                  <textarea
                    rows="3"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={
                      reportType === "missing_person"
                        ? "Birthmarks, height, clothes worn, hair style, tattoos, etc."
                        : reportType === "missing_pet"
                        ? "Collar color, breed characteristics, microchip ID, markings, etc."
                        : "Serial number, stickers, specific scratches, engravings, etc."
                    }
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Detailed Description
                  </label>

                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the circumstance, appearance, condition, etc."
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving || status === "matched"}
                    className="flex-1 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(backPath)}
                    className="flex-1 rounded-full border-2 border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel & Go Back
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-4xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Report Status
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle()}`}
                >
                  {status || "pending"}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <p className="text-slate-600">Date Created:</p>
                  <p className="text-right font-semibold">
                    {createdAt || "Not available"}
                  </p>
                </div>

                <div className="flex justify-between gap-4">
                  <p className="text-slate-600">Report Type:</p>
                  <p className="font-semibold capitalize">
                    {reportType.replace("_", " ")}
                  </p>
                </div>
              </div>

              {status === "matched" && (
                <div className="mt-6 rounded-3xl bg-green-50 p-4 text-sm text-green-700">
                  This report is already matched, so it cannot be edited.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </RoleBasedLayout>
  );
}

export default EditReport;