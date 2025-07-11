import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
