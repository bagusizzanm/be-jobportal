import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Rejected", "Accepted"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Application", applicationSchema);
