import dotenv from "dotenv";
dotenv.config();

export default {
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  api: {
    // Google Maps Platform configuration
    key: process.env.GOOGLE_API_KEY,
    baseUrl:
      process.env.GOOGLE_MAPS_API_URL || "https://maps.googleapis.com/maps/api",
    provider: "google",
  },
  // Google API specific settings
  google: {
    directions: {
      endpoint: "/directions/json",
      mode: "driving", // Options: driving, walking, bicycling, transit
      optimize: true,
    },
    maps: {
      version: "weekly",
      libraries: ["places"],
    },
  },
  logging: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
};
