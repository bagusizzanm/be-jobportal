import express from "express";

import {
  updateProfile,
  deleteResume,
  getUserDetails,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.put("/update-profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);

// Public routes
router.get("/:id", getUserDetails);

export default router;
