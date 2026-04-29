import express from "express";
import {
  getTotalLeads,
  getStatusStats,
  getCityStats,
  getServiceStats,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/total", getTotalLeads);
router.get("/status", getStatusStats);
router.get("/city", getCityStats);
router.get("/service", getServiceStats);

export default router;