import axios from "axios";

const ResultAPI = axios.create({
  baseURL: "http://localhost:5000/api/interview",
});

export const saveResult = (data) =>
  ResultAPI.post("/save-result", data);

export const getHistory = () =>
  ResultAPI.get("/history");

export default ResultAPI;