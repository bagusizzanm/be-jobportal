import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/User.js";

// Konfigurasi path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Update profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      avatar,
      resume,
      companyName,
      companyDescription,
      companyLogo,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    user.resume = resume || user.resume;

    // untuk employer, dibolehkan utk update company
    if (user.role === "employer") {
      user.companyName = companyName || user.companyName;
      user.companyDescription = companyDescription || user.companyDescription;
      user.companyLogo = companyLogo || user.companyLogo;
    }
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        companyName: user.companyName,
        companyDescription: user.companyDescription,
        companyLogo: user.companyLogo,
        resume: user.resume,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resume file for jobseeker only
// @route   DELETE /api/user/resume
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    // ekstrak filename dari URL
    const filename = resumeUrl?.split("/")?.pop();
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "jobseeker")
      return res
        .status(403)
        .json({ message: "Only jobseeker can delete resume" });

    const filePath = path.join(__dirname, "../uploads/", filename);
    // cek apakah file ada di server
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      user.resume = "";
      await user.save();
      res.json({ message: "Resume deleted successfully" });
    } else {
      res.status(404).json({ message: "Resume not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    GET user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ status: "OK", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
