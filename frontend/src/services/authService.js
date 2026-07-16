import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

/* ==========================
   Signup
========================== */

export const signupUser = (data) =>
  API.post("/signup", data);

/* ==========================
   Login
========================== */

export const loginUser = (data) =>
  API.post("/login", data);

/* ==========================
   Forgot Password
========================== */

export const forgotPassword = (email) =>
  API.post("/forgot-password", {
    email,
  });

/* ==========================
   Verify OTP
========================== */

export const verifyOtp = (data) =>
  API.post("/verify-otp", data);

/* ==========================
   Reset Password
========================== */

export const resetPassword = (data) =>
  API.post("/reset-password", data);

export default API;