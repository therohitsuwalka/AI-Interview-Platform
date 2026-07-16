import express from "express";

import {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/* =====================================================
   Authentication
===================================================== */

router.post("/signup", signup);

router.post("/login", login);

/* =====================================================
   Forgot Password
===================================================== */

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-otp",
  verifyOtp
);

router.post(
  "/reset-password",
  resetPassword
);

export default router;