import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* =====================================================
   Upload Resume
===================================================== */

export const uploadResumeToCloudinary = async (filePath) => {
  try {

    const result = await cloudinary.uploader.upload(filePath, {

      folder: "AIInterviewPlatform/Resume",

      resource_type: "raw",

    });

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    return result.secure_url;

  } catch (error) {

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    throw error;

  }
};

/* =====================================================
   Upload Profile Image
===================================================== */

export const uploadImageToCloudinary = async (filePath) => {

  try {

    const result = await cloudinary.uploader.upload(filePath, {

      folder: "AIInterviewPlatform/Profile",

      resource_type: "image",

    });

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    return result.secure_url;

  } catch (error) {

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    throw error;

  }

};