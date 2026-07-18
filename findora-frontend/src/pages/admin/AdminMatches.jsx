import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API_BASE_URL from "../../config/api";

function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [matchRunning, setMatchRunning] = useState(false);
  const [error, setError] = useState("");

  const adminUser = JSON.parse(localStorage.getItem("findora_user"));

  const fetchPendingMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/get_pending_matches.php`
      );

      const text = await response.text();
      console.log("Raw pending matches response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Pending matches:", data);

      if (data.status === "success") {
        setMatches(data.matches || []);
      } else {
        setError(data.message || "Failed to load pending matches.");
      }
    } catch (err) {
      console.error("Pending matches error:", err);
      setError(
        err.message ||
          "Backend connection failed. Please check get_pending_matches.php."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMatches();
  }, []);

  const handleRunMatching = async () => {
    if (!adminUser || adminUser.role !== "admin") {
      alert("Admin login required.");
      return;
    }

    const confirmRun = window.confirm(
      "Do you want to run match detection now?"
    );

    if (!confirmRun) return;

    setMatchRunning(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/matching/match_reports.php`,
        {
          method: "POST",
        }
      );

      const text = await response.text();
      console.log("Raw matching response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Matching response:", data);

      if (data.status === "success") {
        alert(data.message || "Match detection completed.");
        fetchPendingMatches();
      } else {
        alert(data.message || "Match detection failed.");
      }
    } catch (err) {
      console.error("Run matching error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check match_reports.php."
      );
    } finally {
      setMatchRunning(false);
    }
  };

  const handleMatchAction = async (matchId, action) => {
    if (!adminUser || adminUser.role !== "admin") {
      alert("Admin login required.");
      return;
    }

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this match?`
    );

    if (!confirmAction) return;

    setActionLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify_match.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match_id: matchId,
          admin_id: adminUser.user_id,
          action: action,
        }),
      });

      const text = await response.text();
      console.log("Raw verify match response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return valid JSON.");
      }

      console.log("Verify match response:", data);

      if (data.status === "success") {
        alert(data.message);
        fetchPendingMatches();
      } else {
        alert(data.message || "Action failed.");
      }
    } catch (err) {
      console.error("Match action error:", err);
      alert(
        err.message ||
          "Backend connection failed. Please check verify_match.php."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-6 text-slate-700">Loading pending matches...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-red-600">{error}</p>

          <button
            onClick={fetchPendingMatches}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-4xl bg-slate-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Findora Admin
          </p>

          <h1 className="mt-4 text-4xl font-semibold">Pending Matches</h1>

          <p className="mt-3 text-sm text-slate-300">
            Review system-detected lost and found report matches before
            notifying users.
          </p>
        </div>

        <div className="rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Match Review Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Total pending matches: {matches.length}
              </p>
            </div>

            <button
              onClick={handleRunMatching}
              disabled={matchRunning}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {matchRunning ? "Running..." : "Run Match Detection"}
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
              No pending matches found. Click{" "}
              <span className="font-semibold text-blue-600">
                Run Match Detection
              </span>{" "}
              to check for new matches.
            </div>
          ) : (
            <div className="space-y-5">
              {matches.map((match) => (
                <div
                  key={match.match_id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-blue-700">
                          Match ID #{match.match_id}
                        </p>

                        <h3 className="mt-1 text-xl font-semibold text-slate-900">
                          Similarity Score: {match.similarity_score}%
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                            Lost Report
                          </p>

                          <h4 className="mt-2 font-semibold text-slate-900">
                            {match.lost_title}
                          </h4>

                          <p className="mt-2 text-sm text-slate-600">
                            {match.lost_description}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            Location: {match.lost_location}
                          </p>

                          <p className="text-xs text-slate-500">
                            Date: {match.lost_date}
                          </p>

                          <p className="text-xs text-slate-500">
                            Owner: {match.lost_owner_first_name}{" "}
                            {match.lost_owner_last_name}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600">
                            Found Report
                          </p>

                          <h4 className="mt-2 font-semibold text-slate-900">
                            {match.found_title}
                          </h4>

                          <p className="mt-2 text-sm text-slate-600">
                            {match.found_description}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            Location: {match.found_location}
                          </p>

                          <p className="text-xs text-slate-500">
                            Date: {match.found_date}
                          </p>

                          <p className="text-xs text-slate-500">
                            Finder: {match.finder_first_name}{" "}
                            {match.finder_last_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                          {match.category}
                        </span>

                        <span className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700">
                          {match.district}
                        </span>

                        <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700">
                          Pending
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 lg:flex-col">
                      <button
                        onClick={() =>
                          handleMatchAction(match.match_id, "verified")
                        }
                        disabled={actionLoading}
                        className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Verify
                      </button>

                      <button
                        onClick={() =>
                          handleMatchAction(match.match_id, "rejected")
                        }
                        disabled={actionLoading}
                        className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminMatches;