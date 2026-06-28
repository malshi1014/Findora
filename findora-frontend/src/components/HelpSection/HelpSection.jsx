import { Link } from "react-router-dom";

const helpItems = [
  {
    title: "Lost Items",
    description: "Report lost items with details, images and unique identifiers.",
    icon: "🎒",
    link: "/report-lost",
  },
  {
    title: "Found Items",
    description: "Submit found item reports and help reconnect owners.",
    icon: "🔍",
    link: "/report-found",
  },
  {
    title: "Missing Persons",
    description: "Report missing persons with photos and distinguishing details.",
    icon: "👤",
    link: "/report-person",
  },
  {
    title: "Missing Pets",
    description: "Help reunite lost pets with their families quickly.",
    icon: "🐾",
    link: "/report-pet",
  },
];

function HelpSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 ">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-950">
          How Can We Help?
        </h2>
        <p className="mt-3 text-slate-600">
          Choose a category to get started with the recovery process.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {helpItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="rounded-4xl bg-blue-300
            backdrop-blur-xl
            border-white/40
            shadow-2xl border p-6  transition hover:-translate-y-1 hover:shadow-xl hover:border-blue-300"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-3xl">
              {item.icon}
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-950">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default HelpSection;
