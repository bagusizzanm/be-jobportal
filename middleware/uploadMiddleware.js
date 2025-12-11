import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// konfigurasi storage cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "jobportal", // folder di Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// filter khusus file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
