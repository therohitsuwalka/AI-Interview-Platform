import mongoose from "mongoose";

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: String,
      required: true,
    },

    problemTitle: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    verdict: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Partial", "Compilation Error", "Error"],
      default: "Error",
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    passedCount: {
      type: Number,
      default: 0,
    },

    totalCount: {
      type: Number,
      default: 0,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CodingSubmission", codingSubmissionSchema);
