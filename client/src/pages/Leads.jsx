import { useEffect, useState } from "react";
import API from "../services/api";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    service: "",
    budget: "",
    status: "New",
  });

  // FETCH LEADS
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

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      mobile: "",
      email: "",
      city: "",
      service: "",
      budget: "",
      status: "New",
    });
    setEditingId(null);
  };

  // CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/leads/${editingId}`, form);
      } else {
        await API.post("/leads", form);
      }

      resetForm();
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT LEAD
  const handleEdit = (lead) => {
    setForm({
      name: lead.name || "",
      mobile: lead.mobile || "",
      email: lead.email || "",
      city: lead.city || "",
      service: lead.service || "",
      budget: lead.budget || "",
      status: lead.status || "New",
    });

    setEditingId(lead._id || lead.id);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 sm:px-6 lg:px-10 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-slate-500">Manage your customer leads</p>
        </div>

        <button
          onClick={fetchLeads}
          className="px-4 py-2 text-sm rounded-lg bg-slate-200 dark:bg-slate-800 hover:opacity-80"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

        {/* FORM */}
        <div className="bg-slate-200/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-700 rounded-2xl p-6 shadow-xl sticky top-6 h-fit">

          <h2 className="text-sm font-semibold mb-4">
            {editingId ? "Update Lead" : "Create Lead"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name"
              className="input" />

            <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile"
              className="input" />

            <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
              className="input" />

            <input name="city" value={form.city} onChange={handleChange} placeholder="City"
              className="input" />

            <input name="service" value={form.service} onChange={handleChange} placeholder="Service"
              className="input" />

            <input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget"
              type="number"
              className="input" />

            <select name="status" value={form.status} onChange={handleChange}
              className="input">

              <option>New</option>
              <option>Interested</option>
              <option>Converted</option>
              <option>Rejected</option>
            </select>

            <button className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white">
              {editingId ? "Update Lead" : "Save Lead"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2 rounded-lg bg-slate-500 hover:bg-slate-600 text-white"
              >
                Cancel
              </button>
            )}

          </form>
        </div>

        {/* TABLE */}
        <div className="bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">

          <div className="px-5 py-4 border-b flex justify-between bg-slate-300/40 dark:bg-slate-950/40">
            <h2 className="text-sm font-semibold">All Leads</h2>
            <span className="text-xs text-slate-500">{leads.length} records</span>
          </div>

          <div className="overflow-x-auto">

            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading...</div>
            ) : (
              <table className="w-full text-sm">

                <thead className="text-left border-b text-slate-500">
                  <tr>
                    <th className="p-3">Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Service</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id || lead.id}
                      className="border-b hover:bg-slate-300/30 dark:hover:bg-slate-800/40">

                      <td className="p-3">{lead.name}</td>
                      <td>{lead.mobile}</td>
                      <td>{lead.email}</td>
                      <td>{lead.city}</td>
                      <td>{lead.service}</td>
                      <td>₹{lead.budget}</td>

                      <td>
                        <span className="px-2 py-1 text-xs rounded bg-slate-300 dark:bg-slate-800">
                          {lead.status}
                        </span>
                      </td>

                      <td>
                        <button
                          onClick={() => handleEdit(lead)}
                          className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>
        </div>
      </div>

      {/* INPUT STYLE FIX */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 8px;
            border-radius: 10px;
            outline: none;
            background: rgba(148,163,184,0.15);
            border: 1px solid rgba(148,163,184,0.3);
          }
        `}
      </style>

    </div>
  );
}