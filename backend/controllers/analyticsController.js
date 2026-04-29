import Lead from "../models/Lead.js";
import { runPythonAnalysis } from "../utils/runPython.js";

export const getAnalytics = async (req, res) => {
  try {
    const leads = await Lead.find();

    // Convert Mongo docs to plain JSON
    const cleanData = leads.map((lead) => ({
      name: lead.name,
      city: lead.city,
      service: lead.service,
      status: lead.status,
      budget: lead.budget,
      createdAt: lead.createdAt,
    }));

    const insights = await runPythonAnalysis(cleanData);

    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};