import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const contactItems = [
  {
    title: "Visit Us",
    description: [
      "Uwa Wellassa University,",
      "Passara Road,",
      "Badulla",
    ],
    icon: "📍",
  },
  {
    title: "Email Us",
    description: [
      "Our team typically replies within 2 hours.",
      "support@findora.com",
    ],
    icon: "✉️",
  },
  {
    title: "Call Us",
    description: [
      "Mon-Fri from 8am to 5pm.",
      "+94 xx xxx xxxx",
    ],
    icon: "📞",
  },
];

const faqs = [
  {
    question: "How do I list a found item?",
    answer:
      "Navigate to the 'Report Found' section, upload a photo, and provide basic details about where it was located.",
  },
  {
    question: "Is there a fee for recovery?",
    answer:
      "Findora is free for basic listings. We offer premium visibility options to help items get noticed faster.",
  },
  {
    question: "How is my data protected?",
    answer:
      "We use industry-standard encryption and never share your exact location or personal details publicly.",
  },
];

function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
            Contact Us
          </p>
          <h1 className="mt-6 text-4xl font-bold text-slate-950 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            We&apos;re here to help you reconnect with what matters. Reach out to our dedicated
            support team for questions, recovery assistance, or general inquiries.
          </p>
        </div>

        <div className="mt-16 grid gap-10 xl:grid-cols-[0.8fr_1.2fr] items-start">
          <div className="space-y-6">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-100 text-2xl">
                  {item.icon}
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">
                  {item.title}
                </h2>
                <div className="mt-3 space-y-1 text-sm leading-7 text-slate-600">
                  {item.description.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/10">
            <h2 className="text-2xl font-semibold text-slate-950">
              Send a Message
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Share your concern and our team will get back to you shortly.
            </p>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Full Name</span>
                  <input
                    type="text"
                    placeholder="Duvindu Weerathunga"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email Address</span>
                  <input
                    type="email"
                    placeholder="duvinduweerathunga@gmail.com"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Subject</span>
                <select
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Report a Lost Item</option>
                  <option>Report a Found Item</option>
                  <option>Missing Pet Assistance</option>
                  <option>General Inquiry</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Message</span>
                <textarea
                  rows="5"
                  placeholder="How can we help you today?"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <section className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-950">
              Common Questions
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Quick answers to help you navigate Findora.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
