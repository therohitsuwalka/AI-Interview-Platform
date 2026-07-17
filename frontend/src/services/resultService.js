import api from "./api";

export const saveResult = (data) =>
  api.post("/interview/save-result", data);

export const getHistory = () =>
  api.get("/interview/history");

export default api;