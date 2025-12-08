import express from "express";
import {
  saveJob,
  getSavedJobs,
  unsaveJob,
} from "../controller/savedJobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);
router.get("/my-job", protect, getSavedJobs);

export default router;
