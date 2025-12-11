import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// multer menggunakan memory storage (file disimpan di buffer)
const upload = multer();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// fungsi helper untuk upload ke cloudinary
export const uploadToCloudinary = (file, folderName = "jobportal") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    // convert buffer → stream → kirim ke Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export default upload;
