import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Donation() {
  const presetAmounts = [500, 1000, 2500, 5000];
  const [amount, setAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const chooseAmount = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(v);
    if (v) setAmount(Number(v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { amount, fullName, email, anonymous };
    console.log("donation payload", payload);
    alert("Donation confirmed (stub)");
  };

  return (
    <DashboardLayout>
      <div className="min-h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)" }}>
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="inline-block self-start px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-700 text-sm font-semibold uppercase tracking-[0.24em]">Our Cause</span>
                  <h1 className="mt-4 text-3xl font-bold text-slate-950">Support Our Mission</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Your contribution helps us reunite families, find beloved pets, and return precious belongings. Together, we build a safer, more connected community.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/40 backdrop-blur px-4 py-3 shadow-sm shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white text-lg font-bold">D</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                    <p className="text-sm text-slate-500">Donations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-3xl font-bold text-slate-950">$1.2M+</p>
                <p className="text-sm text-slate-500 mt-1">Total Impact</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-3xl font-bold text-slate-950">15,400</p>
                <p className="text-sm text-slate-500 mt-1">People Helped</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-3xl font-bold text-slate-950">100%</p>
                <p className="text-sm text-slate-500 mt-1">Transparent</p>
              </div>
            </div>

            <div className="p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
              <form onSubmit={handleSubmit} className="space-y-9">
                <p className="text-lg font-semibold text-slate-900">Complete Your Donation</p>

                <div className="flex flex-wrap items-center gap-3">
                  {presetAmounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => chooseAmount(a)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 ${
                        amount === a && !customAmount
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-white/40 backdrop-blur text-slate-700 border border-white/40 hover:bg-white/60"
                      }`}
                    >
                      Rs {a.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => chooseAmount(0)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 ${
                      customAmount
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-white/40 backdrop-blur text-slate-700 border border-white/40 hover:bg-white/60"
                    }`}
                  >
                    Custom
                  </button>
                  {customAmount !== undefined && (
                    <input
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-36 rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Full Name</span>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name"
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Email Address</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Card Number</span>
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456"
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Expiry</span>
                    <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM / YY"
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">CVC</span>
                    <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC"
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={anonymous} onChange={() => setAnonymous(!anonymous)}
                    className="h-4 w-4 rounded border-white/40 bg-white/40 accent-blue-600" />
                  Donate Anonymously
                </label>

                <button type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                  Confirm Secure Donation
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Donation;
