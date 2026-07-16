import api from "./api";

// Generate Interview
export const generateInterview = (data) =>
  api.post("/interview/generate", data);

// Evaluate Interview
export const evaluateInterview = (data) =>
  api.post("/interview/evaluate", data);

// History
export const getInterviewHistory = () =>
  api.get("/interview/history");

// Single Interview
export const getInterviewById = (id) =>
  api.get(`/interview/${id}`);