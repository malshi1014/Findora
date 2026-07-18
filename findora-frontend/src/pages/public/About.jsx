import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const missionPoints = [
  {
    title: "Verified Reports",
    description:
      "All reports are verified by our community moderation team to ensure authenticity and reliability.",
    icon: "✅",
  },
  {
    title: "Secure Contact",
    description:
      "Your personal information stays private. Contact happens through our secure messaging system.",
    icon: "🔒",
  },
  {
    title: "Community Moderation",
    description:
      "Active community members help flag suspicious activity and maintain platform integrity.",
    icon: "🛡️",
  },
  {
    title: "Privacy Protected",
    description:
      "We never share your data. Your reports and contacts are encrypted and completely secure.",
    icon: "🧑‍💻",
  },
  {
    title: "Reward System",
    description:
      "Active community members help keep suspicious activity low and maintain platform safety.",
    icon: "🏆",
  },
];

const successStories = [
  {
    quote:
      "After 3 days, someone found my grandmother’s wedding ring. I can’t thank this community enough!",
    name: "Amara Wickremasinghe",
    location: "Colombo, Sri Lanka",
  },
  {
    quote:
      "My cat was missing for a week. Thanks to Findora, a neighbour spotted him and contacted me immediately!",
    name: "Dinesh Gunawardena",
    location: "Kandy, Sri Lanka",
  },
  {
    quote:
      "I lost my laptop bag on the bus. Within 24 hours, the driver returned it with everything intact!",
    name: "Nisha Jayawardena",
    location: "Galle, Sri Lanka",
  },
];

function About() {
  return (
    <div className="min-h-screen relative overflow-hidden text-slate-900 bg-[radial-gradient(circle_at_22%_18%,_#60a5fa,_transparent_28%),radial-gradient(circle_at_68%_12%,_#2216fa,_transparent_20%),radial-gradient(circle_at_50%_90%,_#bfdbfe,_transparent_34%),linear-gradient(135deg,_#93c5fd,_#bfdbfe,_#e0f2fe)]">
      <div className="absolute -top-24 left-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl"></div>
      <div className="absolute top-40 -right-20 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl"></div>
      <div className="absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

      <div className="relative z-10">
        <Navbar />

        <main className="space-y-20 pb-16">
          <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_0.8fr] items-center">
      
      
      <div className="rounded-3xl border border-white/60 bg-white/15 p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-2xl animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">
          About Findora
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Reuniting people with what matters most.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          We are dedicated to reuniting people with what matters most.
          From beloved pets to essential belongings, Findora leverages
          community and technology to bring peace of mind.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="#mission"
            className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800"
          >
            Our Mission
          </a>

          <a
            href="#stories"
            className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/55 px-6 py-3 text-sm font-semibold text-slate-900 shadow-md backdrop-blur-xl transition hover:bg-white/75"
          >
            View Success Stories
          </a>
        </div>
      </div>

      
      <div className="grid gap-4">
        
        
        <div className="rounded-3xl border border-white/60 bg-white/45 p-5 shadow-2xl shadow-blue-900/10 backdrop-blur-2xl animate-fade-up">
          <img
            className="h-72 w-full rounded-2xl object-cover shadow-lg"
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
            alt="Community support"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          
          
          <div className="rounded-3xl border border-white/60 bg-white/45 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-2xl transition hover:bg-white/60 hover:-translate-y-1 animate-fade-up">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">
              Trusted support
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Community verified reports
            </p>
          </div>

          
          <div className="rounded-3xl border border-white/60 bg-white/45 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-2xl transition hover:bg-white/60 hover:-translate-y-1 animate-fade-up">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">
              Safe contact
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Secure messaging and privacy controls
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

          <section id="mission" className="py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">
                  Our Mission
                </p>

                <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
                  Connecting lost items and loved ones with the people who care.
                </h2>

                <p className="mt-6 text-base leading-8 text-slate-700">
                  At Findora, our goal is simple: make reconnection easy. We
                  believe that losing something valuable should not mean losing
                  hope. Our platform is designed to seamlessly connect those who
                  have lost items with those who have found them, fostering a
                  trusted and supportive community.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {missionPoints.slice(0, 3).map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/60 bg-white/55 p-8 shadow-xl shadow-blue-900/10 backdrop-blur-xl"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/80 text-2xl shadow-sm">
                      {item.icon}
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-slate-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="rounded-3xl border border-white/60 bg-white/45 p-8 shadow-xl shadow-blue-900/10 backdrop-blur-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">
                    Why Findora
                  </p>

                  <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
                    Built to bring people together and restore what was lost.
                  </h2>

                  <p className="mt-6 text-base leading-8 text-slate-700">
                    Whether it’s a misplaced wallet, a missing furry friend, or
                    vital documents, we provide the tools and network to bring
                    them back home securely.
                  </p>
                </div>

                <div className="grid gap-6">
                  {missionPoints.slice(3).map((item) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-white/60 bg-white/55 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-xl"
                    >
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100/80 text-2xl shadow-sm">
                        {item.icon}
                      </div>

                      <h3 className="mt-5 text-xl font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-slate-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="stories" className="py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">
                  Real Success Stories
                </p>

                <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
                  See the direct result of your generosity.
                </h2>

                <p className="mt-6 text-base leading-8 text-slate-700">
                  Findora connects people through verified reports and secure
                  communication, helping reunite communities and protect what
                  matters most.
                </p>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {successStories.map((story) => (
                  <div
                    key={story.name}
                    className="rounded-3xl border border-white/60 bg-white/55 p-8 shadow-xl shadow-blue-900/10 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-700/25">
                        ★
                      </div>

                      <div>
                        <p className="text-sm text-slate-600">
                          Verified success
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {story.name}
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 text-slate-700">“{story.quote}”</p>

                    <p className="mt-6 text-sm font-medium text-slate-500">
                      {story.location}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-right">
                <a
                  href="/stories"
                  className="inline-flex items-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800"
                >
                  View All Stories
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default About;