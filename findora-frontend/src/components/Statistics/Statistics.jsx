const stats = [
  {
    value: "50,000+",
    label: "Successful recoveries",
  },
  {
    value: "25,000+",
    label: "Active community members",
  },
  {
    value: "99%",
    label: "Trust rate",
  },
];

function Statistics() {
  return (
    <section className="bg-linear-to-r from-blue-700 via-blue-600 to-sky-600 py-16">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3 text-center text-white">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-3xl bg-white/10 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
            <h3 className="text-5xl font-semibold">{stat.value}</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-blue-100">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;
