function PostCard({ title, location, image, description }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-blue-100/30 backdrop-blur-xl overflow-hidden shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-100/40 hover:shadow-2xl">
      <img
        src={image}
        alt={title}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-gray-500 mt-2">
          📍 {location}
        </p>

        <p className="mt-3 text-sm text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default PostCard;