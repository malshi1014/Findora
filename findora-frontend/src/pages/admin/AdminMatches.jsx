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
        <div className="flex h-full min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto mt-12">
          <h3 className="text-lg font-bold text-red-800">Connection Failed</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchPendingMatches}
            className="mt-5 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
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
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Findora Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Pending Matches</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Review system-detected lost and found report matches before notifying users.
          </p>
        </section>

        {/* Content Box */}
        <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Match Review Queue
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Total pending matches: {matches.length}
              </p>
            </div>

            <button
              onClick={handleRunMatching}
              disabled={matchRunning}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {matchRunning ? "Running Matching Process..." : "Run Match Detection"}
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center text-slate-500 text-sm">
              No pending matches found. Click{" "}
              <button onClick={handleRunMatching} className="font-semibold text-blue-600 hover:underline">
                Run Match Detection
              </button>{" "}
              to check for new matches.
            </div>
          ) : (
            <div className="space-y-6">
              {matches.map((match) => (
                <div
                  key={match.match_id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      <div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          Match ID #{match.match_id}
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-slate-950">
                          Similarity Score: <span className="text-blue-600 font-extrabold">{match.similarity_score}%</span>
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Lost Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                            Lost Report
                          </span>
                          <h4 className="mt-1.5 font-bold text-slate-900 text-sm">
                            {match.lost_title}
                          </h4>
                          <p className="mt-2 text-xs text-slate-500 line-clamp-3">
                            {match.lost_description}
                          </p>
                          <div className="mt-3.5 space-y-1 text-xs text-slate-400 border-t border-slate-100 pt-3">
                            <p><span className="font-semibold text-slate-600">Location:</span> {match.lost_location}</p>
                            <p><span className="font-semibold text-slate-600">Date:</span> {match.lost_date}</p>
                            <p><span className="font-semibold text-slate-600">Owner:</span> {match.lost_owner_first_name} {match.lost_owner_last_name}</p>
                          </div>
                        </div>

                        {/* Found Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            Found Report
                          </span>
                          <h4 className="mt-1.5 font-bold text-slate-900 text-sm">
                            {match.found_title}
                          </h4>
                          <p className="mt-2 text-xs text-slate-500 line-clamp-3">
                            {match.found_description}
                          </p>
                          <div className="mt-3.5 space-y-1 text-xs text-slate-400 border-t border-slate-100 pt-3">
                            <p><span className="font-semibold text-slate-600">Location:</span> {match.found_location}</p>
                            <p><span className="font-semibold text-slate-600">Date:</span> {match.found_date}</p>
                            <p><span className="font-semibold text-slate-600">Finder:</span> {match.finder_first_name} {match.finder_last_name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">
                          {match.category}
                        </span>
                        <span className="rounded-full bg-slate-150 bg-slate-100 px-2.5 py-1 text-slate-600">
                          {match.district}
                        </span>
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-600">
                          Pending Verification
                        </span>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex gap-2.5 lg:flex-col lg:w-32 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-5">
                      <button
                        onClick={() =>
                          handleMatchAction(match.match_id, "verified")
                        }
                        disabled={actionLoading}
                        className="flex-1 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-all disabled:opacity-50"
                      >
                        Verify Match
                      </button>

                      <button
                        onClick={() =>
                          handleMatchAction(match.match_id, "rejected")
                        }
                        disabled={actionLoading}
                        className="flex-1 rounded-full bg-rose-650 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-all disabled:opacity-50"
                      >
                        Reject Match
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