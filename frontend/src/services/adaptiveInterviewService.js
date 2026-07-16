import api from "./api";

// Start a new adaptive interview session
export const startAdaptiveInterview = (data) =>
  api.post("/adaptive/start", data);

// Submit an answer and get evaluation + next question
export const submitAdaptiveAnswer = (data) =>
  api.post("/adaptive/submit-answer", data);

// End the interview early / finalize
export const finishAdaptiveInterview = (data) =>
  api.post("/adaptive/finish", data);

// History of past adaptive sessions
export const getAdaptiveHistory = () =>
  api.get("/adaptive/history");

// Single session (full report)
export const getAdaptiveSessionById = (id) =>
  api.get(`/adaptive/session/${id}`);

// Legacy (kept for backward compatibility)
export const getNextQuestion = (data) =>
  api.post("/adaptive/next-question", data);
