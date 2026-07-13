import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";
import API_BASE_URL from "../../config/api";

function MyReports() {
  const navigate = useNavigate();

  const [lostReports, setLostReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [suspiciousReports, setSuspiciousReports] = useState([]);
  const [missingPetPosts, setMissingPetPosts] = useState([]);
  const [missingPersonPosts, setMissingPersonPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("lost");
  const [loading, setLoading] = useState(true);
  const [deletingKey, setDeletingKey] = useState(null);
  const [error, setError] = useState("");

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

  const fetchMyReports = async () => {
    const user = getCurrentUser();

    if (!user) {
      setError("Please login to view your reports.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reports/get_my_reports.php?user_id=${user.user_id}`
      );

      const text = await response.text();
      console.log("Raw my reports response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("My reports:", data);

      if (data.status === "success") {
        setLostReports(data.lost_reports || []);
        setFoundReports(data.found_reports || []);
        setSuspiciousReports(data.suspicious_reports || []);
        setMissingPetPosts(data.missing_pet_posts || []);
        setMissingPersonPosts(data.missing_person_posts || []);
      } else {
        setError(data.message || "Failed to load reports.");
      }
    } catch (err) {
      console.error("My reports error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_my_reports.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const getCurrentReports = () => {
    if (activeTab === "lost") return lostReports;
    if (activeTab === "found") return foundReports;
    if (activeTab === "suspicious") return suspiciousReports;
    if (activeTab === "missing_pet") return missingPetPosts;
    if (activeTab === "missing_person") return missingPersonPosts;
    return [];
  };

  const getReportId = (report) => {
    if (activeTab === "missing_pet") return report.pet_post_id;
    if (activeTab === "missing_person") return report.person_post_id;
    return report.report_id;
  };

  const getReportTitle = (report) => {
    if (activeTab === "missing_pet") return report.pet_name;
    if (activeTab === "missing_person") return report.full_name;
    return report.title;
  };

  const getReportCategory = (report) => {
    if (activeTab === "missing_pet") return report.pet_category;
    if (activeTab === "missing_person") return "Missing Person";
    return report.category;
  };

  const getReportDate = (report) => {
    if (activeTab === "lost") return report.lost_date;
    if (activeTab === "found" || activeTab === "suspicious") return report.found_date;
    if (activeTab === "missing_pet") return report.lost_date;
    if (activeTab === "missing_person") return report.missing_date;
    return "";
  };

  const getReportTime = (report) => {
    if (activeTab === "lost") return report.lost_time;
    if (activeTab === "found" || activeTab === "suspicious") return report.found_time;
    if (activeTab === "missing_pet") return report.lost_time;
    if (activeTab === "missing_person") return report.missing_time;
    return "";
  };

  const getReportLocation = (report) => {
    if (activeTab === "missing_pet" || activeTab === "missing_person") {
      return report.last_seen_location;
    }

    return report.location;
  };

  const getReportContact = (report) => {
    if (activeTab === "missing_pet" || activeTab === "missing_person") {
      return report.guardian_contact_no;
    }

    return report.contact_no;
  };

  const getReportIdentifiers = (report) => {
    if (activeTab === "missing_person") {
      return report.distinguishing_marks;
    }

    return report.unique_identifiers;
  };

  const handleEdit = (report) => {
    const reportId = getReportId(report);

    if (report.status === "matched") {
      alert("Matched reports cannot be edited.");
      return;
    }

    if (activeTab === "missing_pet" || activeTab === "missing_person") {
      alert("Edit for missing pet/person posts will be connected in the next step.");
      return;
    }

    if (activeTab === "suspicious") {
      alert("Edit for suspicious reports will be connected in the next step.");
      return;
    }

    navigate(`/user-dashboard/edit-report/${activeTab}/${reportId}`);
  };

  const handleDelete = async (report) => {
    const user = getCurrentUser();

    if (!user) {
      alert("Please login again.");
      return;
    }

    if (report.status === "matched") {
      alert("Matched reports cannot be deleted.");
      return;
    }

    if (activeTab === "suspicious") {
      alert("Suspicious reports cannot be deleted from this view yet.");
      return;
    }

    const reportId = getReportId(report);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingKey(`${activeTab}-${reportId}`);

    try {
      const response = await fetch(`${API_BASE_URL}/reports/delete_report.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          report_id: reportId,
          report_type: activeTab,
        }),
      });

      const text = await response.text();
      console.log("Raw delete response:", text);

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Delete response:", data);

      if (data.status === "success") {
        alert("Report deleted successfully.");

        if (activeTab === "lost") {
          setLostReports((prevReports) =>
            prevReports.filter((item) => item.report_id !== reportId)
          );
        } else if (activeTab === "found") {
          setFoundReports((prevReports) =>
            prevReports.filter((item) => item.report_id !== reportId)
          );
        } else if (activeTab === "missing_pet") {
          setMissingPetPosts((prevReports) =>
            prevReports.filter((item) => item.pet_post_id !== reportId)
          );
        } else if (activeTab === "missing_person") {
          setMissingPersonPosts((prevReports) =>
            prevReports.filter((item) => item.person_post_id !== reportId)
          );
        }
      } else {
        alert(data.message || "Failed to delete report.");
      }
    } catch (err) {
      console.error("Delete report error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check delete_report.php."
      );
    } finally {
      setDeletingKey(null);
    }
  };

  const getImageUrl = (report) => {
    if (report.images && report.images.length > 0) {
      return `${API_BASE_URL}/${report.images[0].image_path}`;
    }

    return null;
  };

  const getStatusStyle = (status) => {
    if (status === "matched") return "bg-green-100 text-green-700";
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const currentReports = getCurrentReports();
  const isShopOwner = getCurrentUser()?.role === "shop_owner";

  if (loading) {
    return (
      <RoleBasedLayout>
        <p className="p-6 text-slate-700">Loading your reports...</p>
      </RoleBasedLayout>
    );
  }

  if (error) {
    return (
      <RoleBasedLayout>
        <div className="p-6">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => {
              setLoading(true);
              fetchMyReports();
            }}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-4xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
              My Reports
            </p>

          <h1 className="mt-4 text-3xl font-bold text-slate-950">
            Submitted Reports
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            View your submitted lost items, found items, missing pets and
            missing person posts.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("lost")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeTab === "lost"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Lost Reports ({lostReports.length})
            </button>

            <button
              onClick={() => setActiveTab("found")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeTab === "found"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Found Reports ({foundReports.length})
            </button>

            {isShopOwner && (
              <button
                onClick={() => setActiveTab("suspicious")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  activeTab === "suspicious"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                Suspicious Items ({suspiciousReports.length})
              </button>
            )}

            <button
              onClick={() => setActiveTab("missing_pet")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeTab === "missing_pet"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Missing Pets ({missingPetPosts.length})
            </button>

            <button
              onClick={() => setActiveTab("missing_person")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeTab === "missing_person"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Missing People ({missingPersonPosts.length})
            </button>
          </div>
        </div>

        {currentReports.length === 0 ? (
          <div className="rounded-4xl bg-white p-8 text-center text-slate-500 shadow-xl ring-1 ring-slate-200">
            No {activeTab.replace("_", " ")} reports found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {currentReports.map((report) => {
              const reportId = getReportId(report);
              const imageUrl = getImageUrl(report);
              const title = getReportTitle(report);
              const category = getReportCategory(report);
              const date = getReportDate(report);
              const time = getReportTime(report);
              const location = getReportLocation(report);
              const contact = getReportContact(report);
              const identifiers = getReportIdentifiers(report);
              const deleteKey = `${activeTab}-${reportId}`;

              return (
                <div
                  key={deleteKey}
                  className="rounded-4xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-48 w-full rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                      No Image
                    </div>
                  )}

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {category} • {report.district || "No district"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    {report.description}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-slate-500">
                    {report.nearest_town && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Nearest Town:
                        </span>{" "}
                        {report.nearest_town}
                      </p>
                    )}

                    <p>
                      <span className="font-semibold text-slate-700">
                        Location:
                      </span>{" "}
                      {location}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Date:
                      </span>{" "}
                      {date}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Time:
                      </span>{" "}
                      {time || "Not specified"}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Contact:
                      </span>{" "}
                      {contact}
                    </p>

                    {activeTab === "missing_person" && report.age && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Age:
                        </span>{" "}
                        {report.age}
                      </p>
                    )}

                    {activeTab === "missing_person" && report.gender && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Gender:
                        </span>{" "}
                        {report.gender}
                      </p>
                    )}

                    {identifiers && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Identifiers:
                        </span>{" "}
                        {identifiers}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(report)}
                      disabled={report.status === "matched"}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        report.status === "matched"
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {report.status === "matched" ? "Cannot Edit" : "Edit"}
                    </button>

                    <button
                      onClick={() => handleDelete(report)}
                      disabled={
                        deletingKey === deleteKey || report.status === "matched"
                      }
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        report.status === "matched"
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {deletingKey === deleteKey
                        ? "Deleting..."
                        : report.status === "matched"
                        ? "Cannot Delete"
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
}

export default MyReports;