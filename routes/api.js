import express from "express";
import * as routeService from "../services/routeService.js";

const router = express.Router();

// Get route between two points
router.get("/directions", async (req, res) => {
  try {
    const { origin, destination, waypoints } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        error: "Origin and destination are required",
      });
    }

    // Convert waypoints string to array if present
    const waypointsArray = waypoints ? waypoints.split("|") : [];

    const routeData = await routeService.getDirections(
      origin,
      destination,
      waypointsArray
    );

    const formattedData = routeService.formatRouteData(routeData);
    res.json(formattedData);
  } catch (error) {
    console.error("API route error:", error);
    res.status(error.status || 500).json({
      error: error.message || "Failed to get directions",
    });
  }
});

export default router;
