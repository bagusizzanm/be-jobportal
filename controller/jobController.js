import Application from "../models/Application.js";
import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";

// @desc    Membuat job baru
// @route   POST /api/jobs
// @access  Private (employer only)
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ message: "Only employer can post jobs" });

    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json({ message: "Job created successfully", dataJob: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get semua job oleh semua role user
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  const { keyword, location, category, jobType, minSalary, maxSalary, userId } =
    req.query;

  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(jobType && { jobType }),
  };

  if (minSalary || maxSalary) {
    query.$and = [];
    if (minSalary) query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    if (maxSalary) query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    if (query.$and.length === 0) delete query.$and;
  }

  try {
    const jobs = await Job.find(query).populate(
      "company",
      "name companyName companyLogo"
    );

    let savedJobIds = [];
    let appliedJobStatus = {};

    if (userId) {
      // Saved Jobs
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select(
        "job"
      );
      savedJobIds = savedJobs.map((savedJob) => String(savedJob.job));

      // Applied Jobs
      const applications = await Application.find({ applicant: userId }).select(
        "job status"
      );
      applications.forEach((app) => {
        appliedJobStatus[String(app.job)] = app.status;
      });
    }
    // tambahkan isSaved dan applicationStatus ke setiap job
    const jobsWithStatus = jobs.map((job) => {
      const jobIdStr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdStr),
        applicationStatus: appliedJobStatus[jobIdStr] || null,
      };
    });

    return res.status(200).json({
      jobs: jobsWithStatus,
      message: jobsWithStatus.length ? "OK" : "No jobs found",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs created by the logged-in employer
// @route   GET /api/jobs/get-jobs-employer
// @access  Private (employer only)
export const getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;
    if (role !== "employer")
      return res.status(403).json({ message: "Access Denied" });

    // Fetch semua job yg diposting oleh employer ini
    const jobs = await Job.find({ company: userId })
      .populate("company", "name companyName companyLogo")
      .lean(); // gunakan .lean() untuk mendapatkan plain JS objects

    // Untuk setiap job, hitung jumlah aplikasi
    const jobsWithApplicationCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });
        return { ...job, applicationCount };
      })
    );

    res.status(200).json(jobsWithApplicationCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const { userId } = req.query;
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });

    let applicationStatus = null;

    if (userId) {
      // Cek apakah job ini disimpan oleh user
      const application = await Application.findOne({
        job: job._id,
        applicant: userId,
      });
      if (application) {
        applicationStatus = application.status;
      }
    }
    res.status(200).json({
      status: "OK",
      dataJob: { ...job.toObject(), applicationStatus },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job by ID
// @route   PUT /api/jobs/:id
// @access  Private (employer only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own jobs" });
    }

    Object.assign(job, req.body);

    const updatedJob = await job.save();
    res
      .status(200)
      .json({ message: "Job updated successfully", dataJob: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job by ID
// @route   DELETE /api/jobs/:id
// @access  Private (employer only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own jobs" });
    }

    await job.deleteOne();
    res.status(200).json({ status: "OK", message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle job status (open/closed)
// @route   PUT /api/jobs/:id/toggle-status
// @access  Private (employer only)
export const toggleJobStatus = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own jobs" });
    }

    job.isClosed = !job.isClosed;
    await job.save();
    return res
      .status(200)
      .json({ status: "OK", message: "Job marked as closed" });
  } catch (er) {
    res.status(500).json({ message: er.message });
  }
};
