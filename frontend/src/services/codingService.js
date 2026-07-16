import api from "./api";

/*
|--------------------------------------------------------------------------
| Coding APIs
|--------------------------------------------------------------------------
*/

export const getProblems = () => api.get("/coding/problems");

export const getProblemById = (id) => api.get(`/coding/problems/${id}`);

export const runCode = (data) => api.post("/coding/run", data);

export const submitCode = (data) => api.post("/coding/submit", data);

export const getCodingHistory = () => api.get("/coding/history");

export default {
  getProblems,
  getProblemById,
  runCode,
  submitCode,
  getCodingHistory,
};
