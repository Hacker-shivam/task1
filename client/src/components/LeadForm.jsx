import { useState, useEffect } from "react";
import API from "../services/api";

export default function LeadForm({ selected, refresh }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    service: "",
    budget: "",
    status: "New",
  });

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (selected) {
      await API.put(`/leads/${selected._id}`, form);
    } else {
      await API.post("/leads", form);
    }

    refresh();
    setForm({
      name: "",
      mobile: "",
      email: "",
      city: "",
      service: "",
      budget: "",
      status: "New",
    });
  };

  return (
    <form onSubmit={submit} className="grid md:grid-cols-3 gap-4 p-4 bg-white shadow rounded">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2" required />
      <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" className="border p-2" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2" required />

      <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2" />
      <input name="service" value={form.service} onChange={handleChange} placeholder="Service" className="border p-2" />
      <input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget" className="border p-2" />

      <select name="status" value={form.status} onChange={handleChange} className="border p-2">
        <option>New</option>
        <option>Interested</option>
        <option>Converted</option>
        <option>Rejected</option>
      </select>

      <button className="bg-blue-500 text-white p-2 rounded col-span-3">
        {selected ? "Update Lead" : "Add Lead"}
      </button>
    </form>
  );
}