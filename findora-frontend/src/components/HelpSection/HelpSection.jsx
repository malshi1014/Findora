import { useNavigate } from "react-router-dom";

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
    title: "Found Suspicious Items",
    description: "Submit reports about suspicious items you've encountered.",
    icon: "⚠️",
    link: "/report-suspicious",
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
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const user = localStorage.getItem("findora_user");
    const token = localStorage.getItem("auth_token");

    return !!user || !!token;
  };

  const handleCardClick = (link) => {
    if (!isLoggedIn()) {
      alert("Please login first to submit a report.");
      return;
    }

    navigate(link);
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
            How We Help
          </p>

          <h2 className="mt-4 text-4xl font-bold text-slate-950">
            Report and Recover with Findora
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Choose the type of report you want to submit. Only logged-in users
            can continue to the report forms.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
  {helpItems.map((item) => (
    <button
      key={item.title}
      type="button"
      onClick={() => handleCardClick(item.link)}
      className="flex h-full min-h-[260px] flex-col items-center rounded-4xl bg-blue-100 p-6 text-center shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
        {item.icon}
      </div>

      <h3 className="mt-5 flex min-h-[48px] items-center justify-center text-base font-bold leading-6 text-slate-950">
        {item.title}
      </h3>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
        {item.description}
      </p>

      <p className="mt-auto pt-5 text-sm font-semibold text-blue-700">
        Submit Report →
      </p>
    </button>
  ))}
</div>
      </div>
    </section>
  );
}

export default HelpSection;