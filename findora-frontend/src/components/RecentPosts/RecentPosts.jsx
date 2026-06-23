import recentPosts from "../../data/RecentPosts";
import PostCard from "./PostCard";

function RecentPosts() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
            Missing Persons & Missing Pets
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            See the latest community posts.
          </h2>
          <p className="max-w-xl text-sm text-slate-600">
          Support our community in finding missing pets and missing people and bringing them safely back to their families.
        </p>
        </div>
        
        
        
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {recentPosts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            location={post.location}
            image={post.image}
            description={post.description}
          />
        ))}
      </div>
    </section>
  );
}

export default RecentPosts;
