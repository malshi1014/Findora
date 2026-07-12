import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopLayout from "../../layouts/ShopLayout";
import API_BASE_URL from "../../config/api";

function ReportSuspiciousItem() {
  const navigate = useNavigate();

  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!details.trim() || !location.trim() || !contact.trim()) {
      setError("Please complete all fields before submitting.");
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      setError("Please login before submitting a report.");
      return;
    }

    if (user.role !== "shop_owner" && user.role !== "admin") {
      setError("Only shop owners can submit suspicious item reports.");
      return;
    }

    setLoading(true);

    try {
      console.log("API BASE URL:", API_BASE_URL);
      console.log("Logged user:", user);

      const response = await fetch(
        `${API_BASE_URL}/reports/add_suspicious_report.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            description: details.trim(),
            location: location.trim(),
            contact_no: contact.trim(),
          }),
        }
      );

      const text = await response.text();
      console.log("Raw suspicious report response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Suspicious report response:", data);

      if (data.status === "success") {
        alert("Suspicious item report submitted successfully. It is pending admin approval.");
        navigate("/shop-owner");
      } else {
        setError(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Failed to submit report."
        );
      }
    } catch (err) {
      console.error("Report submission error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check add_suspicious_report.php."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                Findora Alert
              </p>

              <h1 className="mt-4 text-4xl font-semibold">
                Report Suspicious Item
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Notify the admin team about suspicious items received by your shop.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] bg-slate-950/95 p-8 shadow-2xl shadow-slate-900/40"
        >
          {error && (
            <div className="mb-6 rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6">
            <label className="grid gap-2 text-sm text-slate-300">
              Description of Suspicious Item
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Describe the item, device condition, IMEI/serial if available, or suspicious behavior."
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              Location or Context
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Example: Your shop location or where you noticed it"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              Contact Information
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Phone number or email"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </ShopLayout>
  );
}

export default ReportSuspiciousItem;