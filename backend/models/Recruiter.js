import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    recruiterName: {
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

    companyLogo: {
      type: String,
      default: "",
    },

    companyWebsite: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

recruiterSchema.pre("save", async function (next) {

  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    10
  );

  next();

});

const Recruiter = mongoose.model(
  "Recruiter",
  recruiterSchema
);

export default Recruiter;