import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { storiesData, storyCategories } from "../../data/stories";
import { MapPin, Tag, Calendar, X, PenLine, ChevronDown } from "lucide-react";

/* ── Animation presets ────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Helpers ──────────────────────────────────────────────────────── */
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" });
};

/* ── Add Story Modal ──────────────────────────────────────────────── */
function AddStoryModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    category: "Lost & Found",
    title: "",
    story: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.title.trim()) e.title = "Story title is required.";
    if (form.story.trim().length < 30) e.story = "Please write at least 30 characters.";
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    const emojiMap = {
      "Lost & Found": "📦",
      "Missing Pet": "🐾",
      "Missing Person": "🧍",
      "Suspicious Item": "🔍",
    };

    const colors = ["bg-blue-600", "bg-emerald-600", "bg-rose-600", "bg-violet-600", "bg-amber-600", "bg-indigo-600"];

    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      location: form.location.trim(),
      category: form.category,
      emoji: emojiMap[form.category] || "⭐",
      title: form.title.trim(),
      story: form.story.trim(),
      date: new Date().toISOString().slice(0, 10),
      avatar: form.name.trim().split(" ").map((w) => w[0].toUpperCase()).slice(0, 2).join(""),
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6 px-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          🎉
        </div>
        <h3 className="text-xl font-bold text-slate-900">Story Shared!</h3>
        <p className="mt-2 text-sm text-slate-500">
          Thank you for sharing your experience with the Findora community.
        </p>
        <button
          onClick={onClose}
          className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500/30 ${errors[field]
      ? "border-red-300 bg-red-50 focus:border-red-400"
      : "border-slate-200 bg-white focus:border-blue-400"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputClass("name")} placeholder="e.g. Amara Perera" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Location *</label>
          <input name="location" value={form.location} onChange={handleChange} className={inputClass("location")} placeholder="e.g. Colombo, Sri Lanka" />
          {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</label>
        <div className="relative">
          <select name="category" value={form.category} onChange={handleChange} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30">
            {storyCategories.filter((c) => c !== "All Stories").map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Story Title *</label>
        <input name="title" value={form.title} onChange={handleChange} className={inputClass("title")} placeholder="Give your story a short title" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Story *</label>
        <textarea
          name="story"
          value={form.story}
          onChange={handleChange}
          rows={5}
          className={`${inputClass("story")} resize-none`}
          placeholder="Tell us what happened and how Findora helped you…"
        />
        {errors.story && <p className="mt-1 text-xs text-red-500">{errors.story}</p>}
        <p className="mt-1 text-right text-xs text-slate-400">{form.story.length} chars</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">
          Share Story
        </button>
      </div>
    </form>
  );
}

/* ── Story Card ───────────────────────────────────────────────────── */
function StoryCard({ story, onClick }) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group flex cursor-pointer flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all hover:border-blue-200/80 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${story.avatarBg}`}>
          {story.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{story.name}</p>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{story.location}</span>
          </div>
        </div>
      </div>

      {/* Category + Emoji */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xl">{story.emoji}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
          <Tag className="h-2.5 w-2.5" />
          {story.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
        {story.title}
      </h3>

      {/* Excerpt */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
        "{story.story}"
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Calendar className="h-3 w-3" />
          {formatDate(story.date)}
        </div>
        <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700">Read more →</span>
      </div>
    </motion.article>
  );
}

/* ── Story Detail Modal ───────────────────────────────────────────── */
function StoryDetailModal({ story, onClose }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow ${story.avatarBg}`}>
          {story.avatar}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 break-words">{story.title}</h2>
          <p className="mt-0.5 font-medium text-slate-700">{story.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />{story.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{formatDate(story.date)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
              <Tag className="h-2.5 w-2.5" />{story.category}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      <div className="text-3xl text-center">{story.emoji}</div>

      <p className="text-slate-700 leading-relaxed">"{story.story}"</p>

      <div className="pt-2 text-right">
        <button
          onClick={onClose}
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ── Modal wrapper ────────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Main Stories Page ────────────────────────────────────────────── */
function Stories() {
  const [stories, setStories] = useState(storiesData);
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const filtered =
    activeCategory === "All Stories"
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  const handleAdd = (newStory) => {
    setStories((prev) => [newStory, ...prev]);
    setActiveCategory("All Stories");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70" />
      <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl animate-pulse-soft" />
      <div
        className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10">
        <Navbar />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pb-20"
        >
          {/* ── Hero ── */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div
                variants={itemVariants}
                className="mx-auto max-w-3xl text-center"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">
                  Community Stories
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Real Stories, Real Reunions
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Every story here is proof that community makes the difference.
                  Read how people across Sri Lanka found what they lost - and
                  share your own experience.
                </p>

                {/* CTA buttons */}
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <button
                    id="add-story-btn"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 hover:-translate-y-0.5"
                  >
                    <PenLine className="h-4 w-4" />
                    Share Your Story
                  </button>
                  <a
                    href="#stories-grid"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200/60 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition hover:bg-slate-50 hover:border-slate-300"
                  >
                    Browse Stories
                  </a>
                </div>
              </motion.div>



            </div>
          </section>

          {/* ── Stories Grid ── */}
          <section id="stories-grid" className="py-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

              {/* Category filter */}
              <motion.div variants={itemVariants} className="mb-8 flex flex-wrap gap-2">
                {storyCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-white/80 text-slate-600 border border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 backdrop-blur-md"
                      }`}
                  >
                    {cat}
                    {cat !== "All Stories" && (
                      <span className="ml-1.5 text-[10px] opacity-70">
                        ({stories.filter((s) => s.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>

              {/* Section header */}
              <motion.div
                variants={itemVariants}
                className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeCategory === "All Stories" ? "All Stories" : activeCategory}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {filtered.length} {filtered.length === 1 ? "story" : "stories"} found
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200/60 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:self-auto"
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Add Story
                </button>
              </motion.div>

              {/* Grid */}
              {filtered.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center backdrop-blur-md"
                >
                  <p className="text-4xl">📭</p>
                  <p className="mt-3 font-semibold text-slate-700">No stories in this category yet.</p>
                  <p className="mt-1 text-sm text-slate-500">Be the first to share your experience!</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <PenLine className="h-4 w-4" />
                    Share Your Story
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onClick={() => setSelectedStory(story)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </section>

          {/* ── CTA Banner ── */}
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-700 p-8 text-white shadow-xl sm:p-12"
              >
                <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold sm:text-3xl">
                      Have a story to share?
                    </h2>
                    <p className="mt-2 text-blue-100">
                      Your experience can inspire others and strengthen our community.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 hover:-translate-y-0.5"
                  >
                    <PenLine className="h-4 w-4" />
                    Share Your Story
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </motion.main>

        <Footer />
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAddModal && (
          <Modal title="Share Your Story" onClose={() => setShowAddModal(false)}>
            <AddStoryModal
              onClose={() => setShowAddModal(false)}
              onAdd={(story) => {
                handleAdd(story);
                setShowAddModal(false);
              }}
            />
          </Modal>
        )}
        {selectedStory && (
          <Modal title="Success Story" onClose={() => setSelectedStory(null)}>
            <StoryDetailModal
              story={selectedStory}
              onClose={() => setSelectedStory(null)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Stories;
