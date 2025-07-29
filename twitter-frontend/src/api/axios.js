import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g., "http://localhost:4000/api"
  timeout: 30000,
});

// Safely attach Authorization token if it exists
API.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem("user");

    // Only parse if it's not null or the string "undefined"
    if (rawUser && rawUser !== "undefined") {
      const user = JSON.parse(rawUser);

      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (error) {
    console.warn("Invalid user data in localStorage:", error);
  }

  return config;
});

export default API;
