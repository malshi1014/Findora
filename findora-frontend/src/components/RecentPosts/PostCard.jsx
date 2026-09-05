import { useState, useEffect } from "react";
import API_BASE_URL from "../../config/api";
import { Heart, MessageCircle, Trash2, Send, LogIn } from "lucide-react";

function PostCard({ post }) {
  const imageUrl = post.image_path
    ? `${API_BASE_URL.replace(/\/$/, "")}/${post.image_path.replace(/^\/+/, "")}`
    : "";

  const location = [post.last_seen_location, post.nearest_town, post.district]
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(", ");

  const typeLabel =
    post.report_type === "missing_person" ? "Missing Person" : "Missing Pet";

  const reportedDate = post.report_date
    ? new Date(`${post.report_date}T00:00:00`).toLocaleDateString()
    : "";

  /* ── Identify the current visitor ───────────────────────────────── */
  const currentUser = JSON.parse(localStorage.getItem("findora_user") || "null");
  const currentUserId = currentUser?.user_id ?? null;   // null = guest
  const isAdmin       = currentUser?.role === "admin";
  const isLoggedIn    = currentUserId !== null;

  /* ── Derived post IDs ────────────────────────────────────────────── */
  const reportId   = parseInt(post.id.split("-").pop(), 10);
  const reportType = post.report_type; // 'missing_person' | 'missing_pet'

  /* ── Interaction state ───────────────────────────────────────────── */
  const [reactionsCount,      setReactionsCount]      = useState(0);
  const [userHasReacted,      setUserHasReacted]      = useState(false);
  const [comments,            setComments]            = useState([]);
  const [showComments,        setShowComments]        = useState(false);
  const [newComment,          setNewComment]          = useState("");
  const [submittingComment,   setSubmittingComment]   = useState(false);
  const [loadingInteractions, setLoadingInteractions] = useState(true);
  const [loginPrompt,         setLoginPrompt]         = useState("");

  /* ── Fetch counts + comments on mount (public, no auth needed) ───── */
  useEffect(() => {
    let active = true;

    const fetchInteractions = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/interactions/get_interactions.php` +
            `?report_id=${reportId}&report_type=${reportType}`,
          { credentials: "include" }   // sends session cookie if present
        );
        const data = await res.json();
        if (data.status === "success" && active) {
          setReactionsCount(data.reactionsCount);
          setUserHasReacted(data.userHasReacted);
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Interactions fetch failed", err);
      } finally {
        if (active) setLoadingInteractions(false);
      }
    };

    fetchInteractions();
    return () => { active = false; };
  }, [reportId, reportType]);

  /* ── Helpers ─────────────────────────────────────────────────────── */
  const requireLogin = (msg) => {
    setLoginPrompt(msg);
    setTimeout(() => setLoginPrompt(""), 3500);
  };

  /* ── Reaction ────────────────────────────────────────────────────── */
  const handleToggleReaction = async () => {
    if (!isLoggedIn) {
      requireLogin("Please log in to react or comment.");
      return;
    }

    // Optimistic update
    const wasReacted = userHasReacted;
    setUserHasReacted(!wasReacted);
    setReactionsCount((c) => (wasReacted ? c - 1 : c + 1));

    try {
      const res = await fetch(
        `${API_BASE_URL}/interactions/toggle_reaction.php`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ report_id: reportId, report_type: reportType }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setReactionsCount(data.reactionsCount);
        setUserHasReacted(data.userHasReacted);
      } else {
        // Revert
        setUserHasReacted(wasReacted);
        setReactionsCount((c) => (wasReacted ? c + 1 : c - 1));
        if (res.status === 401) requireLogin("Please log in to react or comment.");
      }
    } catch (err) {
      console.error("Toggle reaction failed", err);
      setUserHasReacted(wasReacted);
      setReactionsCount((c) => (wasReacted ? c + 1 : c - 1));
    }
  };

  /* ── Add comment ─────────────────────────────────────────────────── */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      requireLogin("Please log in to react or comment.");
      return;
    }
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/interactions/add_comment.php`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            report_id:    reportId,
            report_type:  reportType,
            comment_text: newComment.trim(),
          }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      } else {
        if (res.status === 401) requireLogin("Please log in to react or comment.");
        else alert(data.message || "Failed to post comment.");
      }
    } catch (err) {
      console.error("Add comment failed", err);
      alert("Network error — please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  /* ── Delete comment ──────────────────────────────────────────────── */
  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn) return;
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/interactions/delete_comment.php`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment_id: commentId, report_type: reportType }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        alert(data.message || "Failed to delete comment.");
      }
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-blue-100/30 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-100/40 hover:shadow-2xl">
      {/* Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={post.title}
          className="h-44 w-full shrink-0 bg-slate-100 object-contain"
        />
      ) : (
        <div className="flex h-44 shrink-0 items-center justify-center bg-slate-200 text-sm text-slate-500">
          No image available
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {typeLabel}
        </span>

        <h3 className="mt-3 text-lg font-semibold">{post.title}</h3>

        <p className="mt-2 text-sm text-gray-500">
          Location: {location || "Not provided"}
        </p>

        {reportedDate && (
          <p className="mt-1 text-xs text-slate-500">
            Last seen: {reportedDate}
            {post.report_time ? ` at ${post.report_time}` : ""}
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
          {post.description}
        </p>

        {post.contact_no && (
          <a
            href={`tel:${post.contact_no}`}
            className="mt-4 inline-flex self-start text-sm font-semibold text-blue-700 hover:underline"
          >
            Contact: {post.contact_no}
          </a>
        )}
      </div>

      {/* Login prompt banner */}
      {loginPrompt && (
        <div className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
          <LogIn className="h-3.5 w-3.5 shrink-0" />
          {loginPrompt}
        </div>
      )}

      {/* Interaction bar */}
      <div className="flex items-center border-t border-slate-200/50 bg-slate-50/50 px-4 py-3">
        {!loadingInteractions && (
          <>
            {/* React button */}
            <button
              onClick={handleToggleReaction}
              title={isLoggedIn ? "React" : "Log in to react"}
              className={`mr-4 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                userHasReacted
                  ? "text-red-500 hover:text-red-600"
                  : "text-slate-500 hover:text-red-400"
              }`}
            >
              <Heart
                className="h-5 w-5"
                fill={userHasReacted ? "currentColor" : "none"}
              />
              <span>{reactionsCount}</span>
            </button>

            {/* Comment toggle */}
            <button
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </button>
          </>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="flex max-h-72 flex-col border-t border-slate-200/50 bg-white/60 p-4">
          {/* Comment list */}
          <div className="mb-3 flex-1 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-slate-400">
                No comments yet. {isLoggedIn ? "Be the first!" : "Log in to comment."}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-200/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {comment.user_name}
                      </span>
                      {isLoggedIn &&
                        (currentUserId === comment.user_id || isAdmin) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-slate-400 transition hover:text-red-500"
                            title="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                    </div>
                    <p className="mt-1 text-slate-600">{comment.text}</p>
                    <span className="mt-1 block text-[10px] text-slate-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment input — shown to everyone, but guests get the login prompt on submit */}
          <form onSubmit={handleAddComment} className="relative mt-auto">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                isLoggedIn ? "Write a comment…" : "Log in to comment…"
              }
              className="w-full rounded-full border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submittingComment}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-blue-600 transition hover:bg-blue-50 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

export default PostCard;
