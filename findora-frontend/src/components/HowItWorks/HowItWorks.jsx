const steps = [
  {
    number: "01",
    title: "Report a Case",
    description: "Submit a lost or found report with as much information as possible.",
  },
  {
    number: "02",
    title: "Find Matches",
    description: "Our system searches for similar reports and surfaces likely matches.",
  },
  {
    number: "03",
    title: "Verify Details",
    description: "Review verified matches before connecting with the other party.",
  },
  {
    number: "04",
    title: "Recover Quickly",
    description: "Communicate securely and complete the recovery process with confidence.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
            Simple Recovery Process
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            How Findora Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Your journey from lost to found is powered by community intelligence and secure
            communication, making recovery faster and more reliable.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                {step.number}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
