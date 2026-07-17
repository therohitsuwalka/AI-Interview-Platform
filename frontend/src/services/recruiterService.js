import api from "./api";

export const recruiterLogin = (data) =>
  api.post("/recruiter/login", data);

export const recruiterSignup = (data) =>
  api.post("/recruiter/signup", data);

export const getRecruiterDashboard = () =>
  api.get("/recruiter/dashboard");

export const getCandidates = (page = 1, search = "") =>
  api.get(`/recruiter/candidates?page=${page}&search=${search}`);

export const getCandidateDetails = (id) =>
  api.get(`/recruiter/candidate/${id}`);

export default api;