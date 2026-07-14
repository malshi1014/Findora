import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import PostCard from "./PostCard";

function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecentPosts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public_posts/get_recent_posts.php`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to load recent posts.");
        }

        setRecentPosts(data.posts || []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Failed to load recent posts.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRecentPosts();
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
            Missing Persons & Missing Pets
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            See the latest community posts.
          </h2>
          <p className="max-w-xl text-sm text-slate-600">
            Support our community in finding missing pets and missing people and
            bringing them safely back to their families.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-slate-500">Loading recent posts...</p>
      ) : error ? (
        <p className="mt-10 rounded-2xl bg-red-50 p-5 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      ) : recentPosts.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          No approved missing-person or missing-pet posts yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentPosts;
