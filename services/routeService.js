import apiClient from "../utils/apiClient.js";
import config from "../config/default.js";

/**
 * Get route directions between two points
 * @param {string} origin - Starting point (address or lat,lng)
 * @param {string} destination - End point (address or lat,lng)
 * @param {Array} waypoints - Optional intermediate points
 * @returns {Promise} - Google Directions API response
 */
export const getDirections = async (origin, destination, waypoints = []) => {
  try {
    if (!origin || !destination) {
      throw new Error("Both origin and destination are required");
    }

    console.log("API request parameters:", {
      origin,
      destination,
      waypoints,
    });

    const waypointParams =
      waypoints.length > 0
        ? { waypoints: `optimize:true|${waypoints.join("|")}` }
        : {};

    const response = await apiClient.get(config.google.directions.endpoint, {
      params: {
        origin,
        destination,
        mode: config.google.directions.mode,
        ...waypointParams,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error(`Directions API error: ${response.data.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
};

/**
 * Format route data for display
 * @param {Object} routeData - Google Directions API response
 * @returns {Object} - Formatted route data
 */
export const formatRouteData = (routeData) => {
  if (!routeData.routes || routeData.routes.length === 0) {
    return { error: "No routes found" };
  }

  const route = routeData.routes[0];
  const leg = route.legs[0]; // For now, we'll just use the first leg

  return {
    distance: leg.distance.text,
    duration: leg.duration.text,
    startAddress: leg.start_address,
    endAddress: leg.end_address,
    steps: leg.steps.map((step) => ({
      instructions: step.html_instructions,
      distance: step.distance.text,
      duration: step.duration.text,
      maneuver: step.maneuver || "",
    })),
    polyline: route.overview_polyline.points,
  };
};
