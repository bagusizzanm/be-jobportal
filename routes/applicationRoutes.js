import express from "express";
import {
  applyForJob,
  getApplicantsForJob,
  getApplicationById,
  getMyApplications,
  updateApplicationStatus,
} from "../controller/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, applyForJob);
router.get("/my-apps", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicantsForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateApplicationStatus);

export default router;
