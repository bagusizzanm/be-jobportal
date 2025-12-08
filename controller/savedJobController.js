import SavedJob from "../models/SavedJob.js";

// @desc    Simpan pekerjaan tertentu
// @route   POST /api/save-jobs/:jobId
// @access  Private
export const saveJob = async (req, res) => {
  try {
    const existingJob = await SavedJob.findOne({
      jobseeker: req.user._id,
      job: req.params.jobId,
    });
    if (existingJob)
      return res.status(400).json({ message: "Job already saved" });

    const savedJob = await SavedJob.create({
      jobseeker: req.user._id,
      job: req.params.jobId,
    });

    res.status(201).json({
      message: "You have successfully saved this job",
      savedJob,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save job", error: error.message });
  }
};

// @desc    Hapus pekerjaan yang disimpan
// @route   DELETE /api/save-jobs/:jobId
// @access  Private
export const unsaveJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only jobseeker can unsave job" });
    }

    const savedJob = await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });
    if (!savedJob)
      return res.status(404).json({ message: "Saved job not found" });

    res.status(200).json({ message: "Job removed from list" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove saved job", error: error.message });
  }
};

// @desc    Dapatkan daftar pekerjaan yang disimpan oleh user jobseeker
// @route   GET /api/save-jobs/my-job
// @access  Private
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobseeker: req.user._id }).populate(
      {
        path: "job",
        populate: { path: "company", select: "name companyName companyLogo" },
      }
    );

    res.status(200).json({ message: "OK", dataSavedJobs: savedJobs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch saved jobs", error: error.message });
  }
};
