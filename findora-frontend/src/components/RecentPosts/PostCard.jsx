function PostCard({ title, location, image, description }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
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