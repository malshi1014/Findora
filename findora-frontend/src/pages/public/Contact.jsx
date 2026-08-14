import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import API_BASE_URL from "../../config/api";

const contactItems = [
  {
    title: "Visit Us",
    description: ["Uva Wellassa University,", "Passara Road,", "Badulla"],
    icon: "📍",
    accent: "from-sky-500 to-blue-600",
  },
  {
    title: "Email Us",
    description: ["Our team typically replies within 2 hours.", "findooora@gmail.com"],
    icon: "✉️",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "Call Us",
    description: ["Mon-Fri from 8am to 5pm.", "+94 77 101 7843"],
    icon: "📞",
    accent: "from-violet-500 to-fuchsia-600",
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

const initialFormState = {
  name: "",
  email: "",
  subject: "Report a Lost Item",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject) {
      nextErrors.subject = "Please select a subject.";
    }

    if (formData.message.trim().length < 10) {
      nextErrors.message = "Please share a bit more detail so we can help you better.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({ type: "error", message: "Please fix the highlighted fields and try again." });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatus({ type: "info", message: "Sending your message..." });

    try {
      const response = await fetch(`${API_BASE_URL}/complaints/send_complaint.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        setStatus({
          type: "success",
          message: data.message || "Thanks! Your message has been received and our team will get back to you shortly.",
        });
        setFormData(initialFormState);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to submit message. Please try again.",
        });
      }
    } catch (err) {
      console.error("Complaint submit error:", err);
      setStatus({
        type: "error",
        message: "Network error — please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.2),_transparent_35%),linear-gradient(135deg,_#eef7ff_0%,_#dbeafe_45%,_#f8fbff_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.24)] backdrop-blur sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
                Contact Us
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                We&apos;re here to help you reconnect with what matters.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Reach out to our support team for recovery assistance, questions, or general inquiries. We&apos;ll make sure your concern is handled with care.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Fast response within 2 hours
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  Support for lost & found cases
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-2xl shadow-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  🤝
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Need help today?
                  </p>
                  <h2 className="text-2xl font-semibold">Talk to our team</h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                Share your concern and we&apos;ll help you take the next step quickly and confidently.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-lg">✉️</span>
                  <span>Send us a message anytime</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-lg">🛡️</span>
                  <span>Your concerns are handled with care</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16 grid gap-8 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
          <div className="space-y-5">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.5rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-2xl text-white`}>
                  {item.icon}
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                <div className="mt-3 space-y-1 text-sm leading-7 text-slate-600">
                  {item.description.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.25)] sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Send a message</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Share your concern and our team will get back to you shortly.
                </p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                Reply usually fast
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Full Name</span>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Duvindu Weerathunga"
                    className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                  />
                  {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email Address</span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="duvinduweerathunga@gmail.com"
                    className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                  />
                  {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Subject</span>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${errors.subject ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                >
                  <option>Report a Lost Item</option>
                  <option>Report a Found Item</option>
                  <option>Missing Pet Assistance</option>
                  <option>General Inquiry</option>
                </select>
                {errors.subject ? <p className="mt-2 text-sm text-red-600">{errors.subject}</p> : null}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Message</span>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${errors.message ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                />
                {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message}</p> : null}
              </label>

              {status.message ? (
                <div
                  aria-live="polite"
                  className={`rounded-2xl border px-4 py-3 text-sm ${status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : status.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                >
                  {status.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        <section className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-950">Common Questions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Quick answers to help you navigate Findora.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
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
