import User from "../models/User.js";
import Interview from "../models/Interview.js";

import {
  uploadResumeToCloudinary,
  uploadImageToCloudinary,
} from "../services/cloudinaryService.js";

/* =====================================================
   Get Profile
===================================================== */

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const interviews = await Interview.find({
      user: req.user.id,
    });

    const totalInterviews = interviews.length;

    const averageScore = totalInterviews
      ? Math.round(
          interviews.reduce(
            (sum, item) => sum + Number(item.overallScore || 0),
            0
          ) / totalInterviews
        )
      : 0;

    const bestScore = totalInterviews
      ? Math.max(
          ...interviews.map((item) =>
            Number(item.overallScore || 0)
          )
        )
      : 0;

    return res.status(200).json({
      success: true,
      user,
      stats: {
        totalInterviews,
        averageScore,
        bestScore,
      },
    });

  } catch (error) {

    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* =====================================================
   Update Profile
===================================================== */

export const updateProfile = async (req, res) => {
  try {

    const { name } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    // Resume Upload

    if (req.file) {

      const resumeUrl =
        await uploadResumeToCloudinary(req.file.path);

      user.resume = resumeUrl;

    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {

    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* =====================================================
   Upload Profile Image
===================================================== */

export const uploadProfileImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const imageUrl =
      await uploadImageToCloudinary(req.file.path);

    user.profileImage = imageUrl;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Image Uploaded Successfully",
      image: imageUrl,
      user,
    });

  } catch (error) {

    console.error("Upload Profile Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};