import { useState } from "react";
import API from "../services/api";

export default function Reports() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);

  // HANDLE FILTER CHANGE
  const handle = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // FETCH FILTERED DATA
  const fetchData = async () => {
    try {
      const res = await API.get("/leads/filter", { params: filters });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // EXPORT CSV (UPDATED WITH ALL FIELDS)
  const exportCSV = () => {
    const rows = [
      ["Name", "Mobile", "Email", "City", "Service", "Budget", "Status"],

      ...data.map((d) => [
        d.name,
        d.mobile,
        d.email,
        d.city,
        d.service,
        d.budget,
        d.status,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads_report.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 sm:px-6 lg:px-10 py-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Filter, analyze and export your lead data
        </p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">

        {["city", "status", "service"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChange={handle}
            className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 outline-none"
          />
        ))}

        <input
          type="date"
          name="startDate"
          onChange={handle}
          className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700"
        />

        <input
          type="date"
          name="endDate"
          onChange={handle}
          className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700"
        />

      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">

        <button
          onClick={fetchData}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
        >
          Apply Filters
        </button>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
        >
          Export CSV
        </button>

        <span className="text-sm text-slate-500 flex items-center">
          {data.length} records found
        </span>

      </div>

      {/* TABLE */}
      <div className="bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-sm">

            {/* HEADER */}
            <thead className="text-left bg-slate-300/40 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3">Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>City</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-500">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((l) => (
                  <tr
                    key={l._id}
                    className="border-t border-slate-300/40 dark:border-slate-800 hover:bg-slate-300/30 dark:hover:bg-slate-800/40 transition"
                  >

                    <td className="p-3">{l.name}</td>
                    <td>{l.mobile}</td>
                    <td>{l.email}</td>
                    <td>{l.city}</td>
                    <td>{l.service}</td>
                    <td>₹{l.budget}</td>

                    <td>
                      <span className="px-2 py-1 text-xs rounded-md bg-slate-300/50 dark:bg-slate-800">
                        {l.status}
                      </span>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}