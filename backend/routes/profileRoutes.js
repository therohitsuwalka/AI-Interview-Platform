import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../controllers/profileController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getProfile
);

/*
|--------------------------------------------------------------------------
| Update Profile + Resume Upload
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  authMiddleware,
  upload.single("resume"),
  updateProfile
);

/*
|--------------------------------------------------------------------------
| Upload Profile Image
|--------------------------------------------------------------------------
*/

router.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage
);

export default router;