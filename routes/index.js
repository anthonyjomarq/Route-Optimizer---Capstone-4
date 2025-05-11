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

    // Handle destinations
    let destinations = [];

    // Check for destinations[] format (could be single value or array)
    if (req.body["destinations[]"]) {
      if (Array.isArray(req.body["destinations[]"])) {
        // It's already an array
        destinations = req.body["destinations[]"];
      } else {
        destinations = [req.body["destinations[]"]];
      }
    } else if (Array.isArray(req.body.destinations)) {
      destinations = req.body.destinations;
    } else if (req.body.destination) {
      destinations = [req.body.destination];
    }

    if (!origin) {
      throw new Error("Origin address is required");
    }

    if (destinations.length === 0) {
      throw new Error("At least one destination is required");
    }

    console.log(
      `Calculating route from ${origin} to ${destinations.length} destinations`
    );

    // Get route data based on number of destinations
    let routeData, formattedData;

    if (destinations.length === 1) {
      // Single destination
      const destination = destinations[0];
      console.log("Making API request with:", { origin, destination });
      routeData = await routeService.getDirections(origin, destination);
      formattedData = routeService.formatRouteData(routeData);

      res.render("result", {
        title: "Optimized Route",
        routeData: formattedData,
        apiKey: config.api.key,
        origin,
        destination,
        destinations: JSON.stringify(destinations),
        isMultiDestination: false,
      });
    } else {
      // Multiple destinations - use optimization
      console.log("Making optimized API request with:", {
        origin,
        destinations,
      });
      routeData = await routeService.getOptimizedRoute(origin, destinations);
      formattedData = routeService.formatMultiDestinationRoute(routeData);

      res.render("result", {
        title: "Optimized Route",
        routeData: formattedData,
        apiKey: config.api.key,
        origin,
        destination: destinations[destinations.length - 1],
        destinations: JSON.stringify(destinations),
        isMultiDestination: true,
      });
    }
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
