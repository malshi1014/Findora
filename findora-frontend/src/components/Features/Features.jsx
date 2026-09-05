import { motion } from "framer-motion";
import { FileEdit, Search, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    title: "Easy Item Reporting",
    description: "Create reports quickly with photos, location info and clear details.",
    icon: FileEdit,
  },
  {
    title: "Smart Search",
    description: "Smart matching helps find relevant recovery leads fast.",
    icon: Search,
  },
  {
    title: "Secure Communication",
    description: "Connect safely with finders and owners through our platform.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Recovery",
    description: "Streamlined workflow keeps every case moving toward resolution.",
    icon: Zap,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
};

function Features() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-blue-600">
            Why Choose Findora?
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            A platform built for speed, security and trust.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Findora provides a seamless process that helps you report lost items, review matches
            and recover quickly with support from the community.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/5 hover:ring-blue-200"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white mb-6">
                <feature.icon className="h-6 w-6" strokeWidth={2} />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-[15px] leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;