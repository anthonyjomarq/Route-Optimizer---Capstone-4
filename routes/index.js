import express from "express";
import config from "../config/default.js";
import * as routeService from "../services/routeService.js";

const router = express.Router();

// Home page route
router.get("/", (req, res) => {
  res.render("index", {
    title: "Route Optimizer",
    provider: "Google Maps",
    apiKey: config.api.key,
  });
});

// Route results page
router.post("/route", async (req, res) => {
  try {
    console.log("Form data received:", req.body);

    const { origin } = req.body;

    let destination;
    if (req.body["destinations[]"]) {
      // Handle single destination in destinations[] format
      destination = req.body["destinations[]"];
    } else if (Array.isArray(req.body.destinations)) {
      // Handle array format
      destination = req.body.destinations[0];
    } else {
      destination = req.body.destination;
    }

    if (!origin) {
      throw new Error("Origin address is required");
    }

    if (!destination) {
      throw new Error("Destination address is required");
    }

    console.log("Making API request with:", { origin, destination });

    // Get route data from Google
    const routeData = await routeService.getDirections(origin, destination);
    const formattedData = routeService.formatRouteData(routeData);

    res.render("result", {
      title: "Optimized Route",
      routeData: formattedData,
      apiKey: config.api.key,
      origin,
      destination,
    });
  } catch (error) {
    console.error("Route error:", error);
    res.render("error", {
      title: "Error",
      error: error.message || "Failed to calculate route",
      stack: error.stack,
    });
  }
});

export default router;
