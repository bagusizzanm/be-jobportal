import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
} from "../controller/authController.js";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-profile", protect, userProfile);

// router.post("/upload-image", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;
//   res.status(200).json({ imageUrl });
// });

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload ke Cloudinary
    const result = await uploadToCloudinary(req.file, "profile");

    return res.status(200).json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;
