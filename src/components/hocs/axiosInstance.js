import axios from "axios";
import { BASE_URL, decryptToken } from "@/utils/constants";
import { useSelector } from "react-redux";

// Get the token from cookies, localStorage, or another storage mechanism
let token = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token"); // Example using localStorage
}

const decryptedToken = decryptToken(token);

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for your API
  headers: {
    Authorization: `Bearer ${decryptedToken}`, // Default Authorization header
    "Content-Type": "application/json", // Default content type for JSON requests
  },
  withCredentials: true, // If your API requires credentials (like cookies) to be sent
});

// Optionally intercept requests to dynamically set Content-Type based on the request
axiosInstance.interceptors.request.use(
  (config) => {
    let updatedToken = null;
    let user = null;
    if (typeof window !== "undefined") {
      updatedToken = decryptToken(localStorage.getItem("token")); // Example using localStorage
      user = JSON.parse(localStorage.getItem("user")); // Example using localStorage
    }
    if (updatedToken) {
      config.headers.Authorization = `Bearer ${updatedToken}`;
    }

    // If the request contains FormData, set Content-Type to multipart/form-data
    if (config.data && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
      config.data.append("operatorId", user?.operatorId);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
