import axios from "axios";

const recruiterAPI = axios.create({
  baseURL: "http://localhost:5000/api/recruiter",
});

recruiterAPI.interceptors.request.use((config) => {

  const token = localStorage.getItem(
    "recruiterToken"
  );

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});

/* ===================================
   Recruiter Login
=================================== */

export const recruiterLogin = (data) =>
  recruiterAPI.post("/login", data);

/* ===================================
   Recruiter Signup
=================================== */

export const recruiterSignup = (data) =>
  recruiterAPI.post("/signup", data);

/* ===================================
   Dashboard
=================================== */

export const getRecruiterDashboard = () =>
  recruiterAPI.get("/dashboard");

/* ===================================
   Candidate List
=================================== */

export const getCandidates = (
  page = 1,
  search = ""
) =>
  recruiterAPI.get(
    `/candidates?page=${page}&search=${search}`
  );

/* ===================================
   Candidate Details
=================================== */

export const getCandidateDetails = (id) =>
  recruiterAPI.get(`/candidate/${id}`);

export default recruiterAPI;