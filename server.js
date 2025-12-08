// API INI DIGUNAKAN UNTUK BACKEND APLIKASI JOB PORTAL
// MENGGUNAKAN EXPRESS.JS SEBAGAI FRAMEWORK UTAMA
// DAN MONGODB SEBAGAI DATABASE

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import connectDB from "./config/db.js";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Konfigurasi path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware untuk handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Koneksi DB
connectDB();

// Middleware untuk parsing JSON
app.use(express.json());
// app.use(dateFormatterMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/save-jobs", savedJobRoutes);
app.use("/api/analytics", analyticsRoutes);

// Server static files (jika ada)
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
