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
              <h1 className="text-3xl font-bold text-slate-950">Support Our Mission</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Your contribution helps us reunite families, find beloved pets, and return precious belongings.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-3xl font-bold text-slate-950">$1.2M+</p>
                <p className="text-sm text-slate-500 mt-1">Total Impact</p>
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 text-center">
                <p className="text-3xl font-bold text-slate-950">15,400</p>
                <p className="text-sm text-slate-500 mt-1">People Helped</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">

              <div className="p-8 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5 flex flex-col gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Selected Amount</p>
                  <p className="mt-2 text-4xl font-bold text-slate-950">Rs {amount.toLocaleString()}</p>
                </div>

                <hr className="border-white/30" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[1px] text-slate-500 mb-3">Quick Select</p>
                  <div className="flex flex-wrap gap-2">
                    {presetAmounts.map((a) => (
                      <button key={a} type="button" onClick={() => chooseAmount(a)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-105 ${
                          amount === a && !customAmount
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-white/40 backdrop-blur text-slate-700 border border-white/40 hover:bg-white/60"
                        }`}>
                        Rs {a.toLocaleString()}
                      </button>
                    ))}
                    <button type="button" onClick={() => chooseAmount(0)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-105 ${
                        customAmount ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white/40 backdrop-blur text-slate-700 border border-white/40 hover:bg-white/60"
                      }`}>
                      Custom
                    </button>
                  </div>
                  {customAmount !== undefined && (
                    <input placeholder="Enter amount" value={customAmount} onChange={handleCustomChange}
                      className="mt-3 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  )}
                </div>

                <div className="mt-auto pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.1V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" />
                      <path d="M22 4L12 14.01L9 11.01" />
                    </svg>
                    Secure payment powered by Stripe
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-blue-600/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-lg font-semibold text-slate-900">Payment Details</p>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Name on Card</span>
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Name on card"
                        className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Email Address</span>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                        className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Card Number</span>
                    <div className="relative mt-2">
                      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456"
                        className="w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 pl-12 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M8 10H16" /><path d="M8 14H12" />
                        </svg>
                      </div>
                    </div>
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Expiry Date</span>
                      <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM / YY"
                        className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">CVC</span>
                      <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC"
                        className="mt-2 w-full rounded-3xl border border-white/40 bg-white/40 backdrop-blur px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <label className="flex items-center gap-3 text-sm text-slate-700 pt-2">
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
      </div>
    </DashboardLayout>
  );
}

export default Donation;
