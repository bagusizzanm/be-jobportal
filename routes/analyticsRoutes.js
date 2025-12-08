import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getEmployerAnalytics } from "../controller/analyticsController.js";

const router = express.Router();

// Route untuk mendapatkan data analitik (contoh sederhana)
router.get("/overview", protect, getEmployerAnalytics);

export default router;
