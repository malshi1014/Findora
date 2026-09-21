import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import PostCard from "../../components/RecentPosts/PostCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { ArrowLeft } from "lucide-react";

function PublicPost() {
  const { type, id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public_posts/get_post.php?type=${type}&id=${id}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to load the post.");
        }

        setPost(data.post);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Failed to load the post.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPost();
    return () => controller.abort();
  }, [type, id]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <Link 
            to="/" 
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500 animate-pulse">Loading post details...</p>
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : !post ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Post not found.</p>
            </div>
          ) : (
            <div className="w-full">
              <PostCard post={post} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PublicPost;
