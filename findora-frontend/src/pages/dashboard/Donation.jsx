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
    // stub: replace with API integration
    const payload = { amount, fullName, email, anonymous };
    console.log("donation payload", payload);
    alert("Donation confirmed (stub)");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl bg-linear-to-r from-slate-100 via-white to-slate-100 p-8 shadow-2xl shadow-slate-300/20 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Our Cause</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">Support Our Mission</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Your contribution helps us reunite families, find beloved pets, and return precious belongings. Together, we build a safer, more connected community.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm shadow-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">D</div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Duvindu</p>
                <p className="text-sm text-slate-500">Donations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-xl shadow-slate-300/10 ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <p className="text-sm font-semibold text-slate-700">Complete Your Donation</p>

              <div className="flex flex-wrap gap-3">
                {presetAmounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => chooseAmount(a)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${amount === a && !customAmount ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Rs {a}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => chooseAmount(0)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${customAmount ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  Rs Custom
                </button>

                <input
                  placeholder="Custom"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="ml-2 w-32 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
                <input
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:col-span-2"
                />
                <input
                  placeholder="MM / YY"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
                <input
                  placeholder="CVC"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:col-span-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={anonymous} onChange={() => setAnonymous(!anonymous)} className="h-4 w-4 rounded" />
                  Donate Anonymously
                </label>
              </div>

              <button type="submit" className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700">Confirm Secure Donation</button>
            </div>
          </form>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$1.2M+</p>
                <p className="text-sm text-slate-500">Total Impact</p>
              </div>
              <div>
                <p className="text-2xl font-bold">15,400</p>
                <p className="text-sm text-slate-500">People Helped</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold">Transparency</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1 text-sm text-slate-600">Platform Maintenance <span className="float-right text-sm font-semibold">45%</span></div>
                <div className="h-3 w-full rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-blue-600" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-slate-600">Community Campaigns <span className="float-right text-sm font-semibold">35%</span></div>
                <div className="h-3 w-full rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-purple-400" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-slate-600">Emergency Grants <span className="float-right text-sm font-semibold">20%</span></div>
                <div className="h-3 w-full rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-slate-400" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold">FAQ</h3>
          <div className="mt-4 space-y-3">
            <details className="rounded-lg border border-slate-100 p-3">
              <summary className="cursor-pointer">Is my donation tax-deductible?</summary>
              <p className="mt-2 text-sm text-slate-600">Yes, Findora is a registered 501(c)(3) non-profit organization. All donations are tax-deductible in the United States to the fullest extent of the law.</p>
            </details>
            <details className="rounded-lg border border-slate-100 p-3">
              <summary className="cursor-pointer">Can I cancel a monthly donation?</summary>
              <p className="mt-2 text-sm text-slate-600">Yes — contact support or manage recurring payments in your account settings.</p>
            </details>
            <details className="rounded-lg border border-slate-100 p-3">
              <summary className="cursor-pointer">How do I receive my receipt?</summary>
              <p className="mt-2 text-sm text-slate-600">Receipts are emailed to the address you provide after a successful donation.</p>
            </details>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Donation;