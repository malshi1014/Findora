import API_BASE_URL from "../../config/api";

function PostCard({ post }) {
  const imageUrl = post.image_path
    ? `${API_BASE_URL.replace(/\/$/, "")}/${post.image_path.replace(/^\/+/, "")}`
    : "";
  const location = [
    post.last_seen_location,
    post.nearest_town,
    post.district,
  ]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .join(", ");
  const typeLabel =
    post.report_type === "missing_person" ? "Missing Person" : "Missing Pet";
  const reportedDate = post.report_date
    ? new Date(`${post.report_date}T00:00:00`).toLocaleDateString()
    : "";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-blue-100/30 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-100/40 hover:shadow-2xl">
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

      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
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
            className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline"
          >
            Contact: {post.contact_no}
          </a>
        )}
      </div>
    </article>
  );
}

export default PostCard;
