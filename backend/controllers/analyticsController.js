import Lead from "../models/Lead.js";
import axios from "axios";


export const getAnalytics = async (req, res) => {
  try {
    const leads = await Lead.find();

    const cleanData = leads.map((lead) => ({
      name: lead.name,
      city: lead.city,
      service: lead.service,
      status: lead.status,
      budget: lead.budget,
      createdAt: lead.createdAt,
    }));

    // 🔥 CALL FLASK SERVER (NOT PYTHON SCRIPT)
    const response = await axios.post(
      "https://task1-1-eg06.onrender.com/analyze",
      cleanData
    );

    return res.json(response.data);
  } catch (error) {
    console.error("Analytics Error:", error.message);

    return res.status(500).json({
      message: "Analytics service failed",
      error: error.message,
    });
  }
};