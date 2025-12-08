import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc    Apply untuk pekerjaan tertentu
// @route   POST /api/application/:jobId
// @access  Private
export const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only jobseeker can apply" });
    }

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
    });

    res.status(201).json({
      message: "You have successfully applied this job",
      dataApplication: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mengambil semua aplikasi pelamar untuk pekerjaan tertentu
// @route   GET /api/application/my-applications
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "OK", dataApplications: apps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mengambil semua pelamar untuk pekerjaan tertentu
// @route   GET /api/application/job/:jobId
// @access  Private
export const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.company.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not allowed to access" });

    const apps = await Application.find({ job: req.params.jobId })
      .populate("job", "title location category jobType")
      .populate("applicant", "name email avatar resume"); // tambahkan populate untuk mendapatkan informasi pelamar({ createdAt: -1 });

    res.status(200).json({ message: "OK", apps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mengambil detail aplikasi berdasarkan ID
// @route   GET /api/application/:id
// @access  Private
export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title")
      .populate("applicant", "name email avatar resume");
    if (!app)
      return res
        .status(404)
        .json({ message: "Application not found", id: req.params.id });

    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();

    if (!isOwner)
      return res.status(403).json({ message: "You are not allowed to access" });

    res.status(200).json({ message: "OK", dataApplication: app });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update status aplikasi
// @route   PUT /api/application/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id).populate("job");
    if (!app || app.job.company.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not allowed to access" });

    app.status = status;
    await app.save();

    res.status(200).json({ message: "Application status updated", status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
