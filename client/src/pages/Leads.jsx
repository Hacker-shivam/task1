import { useEffect, useState } from "react";
import API from "../services/api";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "New",
    city: "",
    service: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/leads", form);
      setForm({ name: "", email: "", status: "New", city: "", service: "" });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 sm:px-6 lg:px-10 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">

        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage and track your leads efficiently
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-200/70 dark:bg-slate-900/60 hover:bg-slate-300/70 dark:hover:bg-slate-800 transition"
        >
          Refresh
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

        {/* FORM */}
        <div className="bg-slate-200/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-300/40 dark:border-slate-700/40 rounded-2xl p-6 shadow-xl sticky top-6 h-fit">

          <h2 className="text-sm font-semibold mb-4">
            Create Lead
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 outline-none"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 outline-none"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 outline-none"
            />

            <input
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="Service"
              className="w-full p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 outline-none"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 outline-none"
            >
              <option>New</option>
              <option>Interested</option>
              <option>Converted</option>
              <option>Rejected</option>
            </select>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
            >
              Save Lead
            </button>

          </form>

        </div>

        {/* TABLE */}
        <div className="bg-slate-200/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-300/40 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">

          {/* HEADER */}
          <div className="px-5 py-4 border-b border-slate-300/40 dark:border-slate-800 flex justify-between items-center bg-slate-300/40 dark:bg-slate-950/40">

            <h2 className="text-sm font-semibold">All Leads</h2>

            <span className="text-xs text-slate-600 dark:text-slate-400">
              {leads.length} records
            </span>

          </div>

          {/* TABLE BODY */}
          <div className="overflow-x-auto">

            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading leads...</div>
            ) : (
              <table className="w-full text-sm">

                <thead className="text-left text-slate-600 dark:text-slate-400 border-b border-slate-300/40 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Service</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-200/40 dark:border-slate-800 hover:bg-slate-300/30 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="p-3">{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.city}</td>
                      <td>{lead.service}</td>
                      <td>
                        <span className="px-2 py-1 text-xs rounded-md bg-slate-300/50 dark:bg-slate-800">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}