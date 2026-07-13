import { useCallback, useEffect, useMemo, useState } from "react";
import API_BASE_URL from "../../config/api";
import RoleBasedLayout from "../../layouts/RoleBasedLayout";

const APPROVED_STATUSES = new Set(["verified", "approved", "matched"]);

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("findora_user"));
  } catch {
    return null;
  }
};

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const getImageUrl = (report) => {
  const path = firstValue(
    report?.image_url,
    report?.image_path,
    report?.images?.[0]?.image_url,
    report?.images?.[0]?.image_path
  );

  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${API_BASE_URL}/${String(path).replace(/^\//, "")}`;
};

const buildReport = (match, prefix, fallbackType) => {
  const nested =
    match[`${prefix}_report`] ||
    (prefix === "lost" ? match.lost_report : match.found_report) ||
    {};

  return {
    id: firstValue(
      nested.report_id,
      nested.id,
      match[`${prefix}_report_id`],
      match[`${prefix}_id`]
    ),
    type: firstValue(nested.report_type, nested.type, fallbackType),
    title: firstValue(nested.title, match[`${prefix}_title`], "Untitled report"),
    description: firstValue(
      nested.description,
      match[`${prefix}_description`],
      "No description provided."
    ),
    category: firstValue(nested.category, match.category, "Uncategorized"),
    location: firstValue(
      nested.location,
      nested.last_seen_location,
      match[`${prefix}_location`],
      match.district,
      "Not specified"
    ),
    district: firstValue(nested.district, match.district),
    date: firstValue(
      nested.report_date,
      nested.lost_date,
      nested.found_date,
      nested.created_at,
      match[`${prefix}_date`]
    ),
    identifiers: firstValue(
      nested.unique_identifiers,
      nested.identifiers,
      match[`${prefix}_unique_identifiers`]
    ),
    contact: firstValue(nested.contact_no, nested.contact),
    imageUrl: getImageUrl(nested) || getImageUrl({ image_path: match[`${prefix}_image_path`] }),
  };
};

const normalizeMatch = (match) => {
  const source = match.user_report || match.source_report;
  const candidate = match.matched_report || match.candidate_report;

  return {
    id: firstValue(match.match_id, match.id),
    status: String(firstValue(match.status, match.match_status, "verified")).toLowerCase(),
    score: Number(firstValue(match.similarity_score, match.confidence_score, 0)),
    verifiedAt: firstValue(match.verified_at, match.approved_at, match.updated_at),
    reason: firstValue(match.match_reason, match.reason, match.admin_note),
    source: source
      ? { ...buildReport({ source_report: source }, "source", source.report_type || "Your report"), imageUrl: getImageUrl(source) }
      : buildReport(match, "lost", "Lost report"),
    candidate: candidate
      ? { ...buildReport({ candidate_report: candidate }, "candidate", candidate.report_type || "Possible match"), imageUrl: getImageUrl(candidate) }
      : buildReport(match, "found", "Found report"),
  };
};

const formatDate = (value) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

function ReportPanel({ report, accent }) {
  const accentStyles =
    accent === "blue"
      ? "bg-blue-50 text-blue-700 ring-blue-100"
      : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {report.imageUrl ? (
        <img
          src={report.imageUrl}
          alt={report.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
          No image available
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${accentStyles}`}>
            {report.type}
          </span>
          <span className="text-xs text-slate-400">
            {report.id ? `Report #${report.id}` : "Report"}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-950">{report.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {report.description}
        </p>

        <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-semibold text-slate-700">Category</dt>
            <dd className="text-slate-500">{report.category}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-semibold text-slate-700">Location</dt>
            <dd className="text-slate-500">{report.location}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-semibold text-slate-700">Date</dt>
            <dd className="text-slate-500">{formatDate(report.date)}</dd>
          </div>
          {report.identifiers && (
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-semibold text-slate-700">Identifiers</dt>
              <dd className="text-slate-500">{report.identifiers}</dd>
            </div>
          )}
          {report.contact && (
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-semibold text-slate-700">Contact</dt>
              <dd className="text-slate-500">{report.contact}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}

function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);
  const score = Math.min(100, Math.max(0, match.score));

  return (
    <section className="rounded-4xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Admin verified
            </span>
            <span className="text-xs font-medium text-slate-400">Match #{match.id}</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Approved {formatDate(match.verifiedAt)}
          </p>
        </div>

        <div className="min-w-44 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Match confidence</span>
            <span className="text-blue-700">{score}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ReportPanel report={match.source} accent="blue" />
        <ReportPanel report={match.candidate} accent="green" />
      </div>

      {match.reason && expanded && (
        <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <span className="font-bold">Why these reports match: </span>
          {match.reason}
        </div>
      )}

      {match.reason && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          {expanded ? "Hide match explanation" : "View match explanation"}
        </button>
      )}
    </section>
  );
}

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchMatches = useCallback(async () => {
    const user = getCurrentUser();

    if (!user?.user_id) {
      setError("Please log in to view your verified matches.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/matching/get_user_matches.php?user_id=${encodeURIComponent(user.user_id)}`,
        { headers: { Accept: "application/json" } }
      );
      const body = await response.text();

      if (!body) throw new Error("The server returned an empty response.");

      let data;
      try {
        data = JSON.parse(body);
      } catch {
        throw new Error("The backend did not return valid JSON.");
      }

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || `Unable to load matches (${response.status}).`);
      }

      const normalized = (data.matches || [])
        .map(normalizeMatch)
        .filter((match) => APPROVED_STATUSES.has(match.status));
      setMatches(normalized);
    } catch (requestError) {
      setError(requestError.message || "Could not connect to the matches service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The request is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMatches();
  }, [fetchMatches]);

  const visibleMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return matches;

    return matches.filter((match) =>
      [
        match.id,
        match.source.title,
        match.source.category,
        match.source.location,
        match.candidate.title,
        match.candidate.category,
        match.candidate.location,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [matches, query]);

  return (
    <RoleBasedLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="overflow-hidden rounded-4xl bg-slate-950 p-7 text-white shadow-xl sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
                Recovery center
              </p>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Your verified matches</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Possible matches appear here only after an administrator reviews and approves them.
              </p>
            </div>
            {!loading && !error && (
              <div className="rounded-3xl bg-white/10 px-6 py-4 ring-1 ring-white/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Approved matches</p>
                <p className="mt-1 text-3xl font-bold">{matches.length}</p>
              </div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="rounded-4xl bg-white p-10 text-center shadow-lg ring-1 ring-slate-200">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading verified matches...</p>
          </div>
        ) : error ? (
          <div className="rounded-4xl bg-white p-8 text-center shadow-lg ring-1 ring-red-100">
            <h2 className="text-lg font-bold text-slate-900">Matches could not be loaded</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchMatches}
              className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-4xl bg-white p-10 text-center shadow-lg ring-1 ring-slate-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 7h10M7 17h10M8 7a4 4 0 0 1 8 0M16 17a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">No verified matches yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              We will show the complete comparison here when an administrator approves a possible match for one of your reports.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Match details</h2>
                <p className="mt-1 text-sm text-slate-500">Compare your report with each approved result.</p>
              </div>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search matches..."
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-xs"
              />
            </div>

            {visibleMatches.length > 0 ? (
              <div className="space-y-6">
                {visibleMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="rounded-4xl bg-white p-8 text-center text-sm text-slate-500 shadow ring-1 ring-slate-200">
                No matches found for “{query}”.
              </div>
            )}
          </>
        )}
      </div>
    </RoleBasedLayout>
  );
}

export default Matches;
