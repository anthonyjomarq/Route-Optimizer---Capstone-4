import axios from "axios";
import config from "../config/default.js";

// Create axios instance for Google API requests
const googleApiClient = axios.create({
  baseURL: config.api.baseUrl,
  params: {
    key: config.api.key,
  },
});

// Handle API errors
googleApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details
    console.error(
      "Google API Error:",
      error.response ? error.response.data : error.message
    );

    // Format error for easier handling
    const formattedError = new Error(
      error.response?.data?.error_message ||
        error.response?.data?.status ||
        "Failed to complete Google API request"
    );

    formattedError.status = error.response?.status || 500;
    formattedError.originalError = error;

    return Promise.reject(formattedError);
  }
);

export default googleApiClient;
