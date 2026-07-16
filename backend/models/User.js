import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    profileImage: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },

    interviews: [
      {
        company: String,
        score: Number,
        feedback: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;