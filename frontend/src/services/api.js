import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  const recruiterToken =
    localStorage.getItem("recruiterToken");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  if (recruiterToken) {
    config.headers.Authorization =
      `Bearer ${recruiterToken}`;
  }

  return config;

});

export default api;