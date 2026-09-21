import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import aboutUsImage from "../../assets/logo/about us image.png";
import { motion } from "framer-motion";

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70"></div>
      <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10">
        <Navbar />

        <motion.main 
          className="space-y-20 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_0.8fr] items-center">
      
      
      <motion.div variants={itemVariants} className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-md">
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
            className="inline-flex items-center justify-center rounded-full border border-slate-200/60 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition hover:bg-slate-50 hover:border-slate-300"
          >
            View Success Stories
          </a>
        </div>
      </motion.div>

      
      <div className="grid gap-4">
        
        
        <motion.div variants={itemVariants} className="relative rounded-3xl border border-blue-100/80 bg-gradient-to-br from-blue-50/50 to-white/80 p-5 shadow-xl shadow-blue-900/5 backdrop-blur-md">
          <div className="absolute -inset-1 -z-10 rounded-3xl bg-blue-400/20 blur-xl opacity-50"></div>
          <img
            className="relative z-10 h-72 w-full rounded-2xl object-cover shadow-md"
            src={aboutUsImage}
            alt="The Lost & Found"
          />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          
          
          <motion.div variants={itemVariants} className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">
              Trusted support
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Community verified reports
            </p>
          </motion.div>

          
          <motion.div variants={itemVariants} className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">
              Safe contact
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Secure messaging and privacy controls
            </p>
          </motion.div>
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
                    className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-md"
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
                <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-md">
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
                      className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md"
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
                    className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-md"
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
        </motion.main>

        <Footer />
      </div>
    </div>
  );
}

export default About;