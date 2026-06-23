const features = [
  {
    title: "Easy Item Reporting",
    description: "Create reports quickly with photos, location info and clear details.",
    icon: "📝",
  },
  {
    title: "AI-Powered Search",
    description: "Smart matching helps find relevant recovery leads fast.",
    icon: "🧠",
  },
  {
    title: "Secure Communication",
    description: "Connect safely with finders and owners through our platform.",
    icon: "🔒",
  },
  {
    title: "Fast Recovery",
    description: "Streamlined workflow keeps every case moving toward resolution.",
    icon: "⚡",
  },
];

function Features() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-400 to-white py-16">
      {/* background blur shapes */}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
            Why Choose Findora?
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            A recovery platform built for speed, security and trust.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-700">
            Findora provides a seamless process that helps you report lost items, review matches
            and recover quickly with support from the community.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-[2rem] border border-white/40 bg-white/25 backdrop-blur-xl p-6 shadow-xl transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white/35 hover:shadow-2xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl text-3xl shadow-md">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-950">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;