import api from "./api";

export const signupUser = (data) =>
  api.post("/auth/signup", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const verifyOtp = (data) =>
  api.post("/auth/verify-otp", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);

export default api;