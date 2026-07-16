import api from "./api";

export const getDashboard = () =>
  api.get("/dashboard/analytics");

export default {
  getDashboard,
};