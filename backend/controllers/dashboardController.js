import Lead from "../models/Lead.js";

// Total Leads
export const getTotalLeads = async (req, res) => {
  try {
    const count = await Lead.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Status-wise
export const getStatusStats = async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// City-wise
export const getCityStats = async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Service-wise
export const getServiceStats = async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: "$service", count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};