import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function EditReport() {
  const [location, setLocation] = useState("Where was it lost seen?");
  const [contact, setContact] = useState("+94 xx xxxx xxx");
  const [lostDate, setLostDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("From");
  const [timeTo, setTimeTo] = useState("To");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { location, contact, lostDate, timeFrom, timeTo, keywords, description };
    console.log("update payload", payload);
    alert("Changes saved (stub)");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      alert("Report deleted (stub)");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link to="#" className="text-sm text-blue-600">↑ Back to Report Details</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-4xl bg-white p-8 shadow-xl">
              <h1 className="text-3xl font-bold text-slate-900">Edit Report</h1>
              <p className="mt-2 text-sm text-slate-600">Update the details of your missing item to help us find a match.</p>

              <form onSubmit={handleSave} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Lost Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Contact Number</label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] xl:grid-cols-[1.2fr_0.4fr_0.4fr]">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Lost Date</label>
                    <input
                      type="date"
                      value={lostDate}
                      onChange={(e) => setLostDate(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Lost Time Range</label>
                    <input
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">&nbsp;</label>
                    <input
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Unique Identifiers / Keywords</label>
                  <textarea
                    rows="3"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Serial number, stickers, specific scratches, engravings, etc."
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Detailed Description</label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the item's condition, unique marks, etc."
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="rounded-4xl border border-dashed border-slate-300 bg-blue-50 p-8 text-center">
                  <div className="flex justify-center text-2xl mb-3">⬇</div>
                  <p className="text-sm font-semibold text-slate-700">Upload Images</p>
                  <p className="mt-1 text-sm text-slate-500">Supports png, jpg, jpeg. Drag & drop or click to browse.</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full border-2 border-slate-200 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel & Go Back
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full rounded-full border-2 border-red-200 bg-red-50 px-6 py-3 text-red-600 font-semibold hover:bg-red-100 transition"
                >
                  Delete Report
                </button>
              </form>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-4xl bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Report Status</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <p className="text-lg font-bold text-slate-900">Active Search</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <p className="text-slate-600">Date Created:</p>
                  <p className="font-semibold">Oct 03, 2023</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-600">Created Matches:</p>
                  <p className="font-semibold">2 Shares</p>
                </div>
              </div>
              <button className="mt-6 w-full rounded-2xl border-2 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel Matches
              </button>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditReport;