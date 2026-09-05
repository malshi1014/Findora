import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
};

function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-blue-600">
            Simple Recovery Process
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How Findora Works
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Your journey from lost to found is powered by community intelligence and secure
            communication, making recovery faster and more reliable.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative"
        >
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10"></div>

          {steps.map((step, index) => (
            <motion.div key={step.number} variants={itemVariants} className="relative group">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md ring-1 ring-slate-100 text-xl font-bold transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                {step.number}
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
