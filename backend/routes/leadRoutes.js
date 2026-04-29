import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  filterLeads,
  exportLeadsCSV,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();

//  routes 
router.get("/filter", filterLeads);
router.get("/export", exportLeadsCSV);
router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;