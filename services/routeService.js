// services/routeService.js
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
 * Format route data for display (single destination)
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

/**
 * Get optimized route with multiple destinations, always returning to origin
 * @param {string} origin - Starting point
 * @param {Array} destinations - Array of destination addresses
 * @returns {Promise} - Optimized route data
 */
export const getOptimizedRoute = async (origin, destinations) => {
  try {
    if (!origin) {
      throw new Error("Origin is required");
    }

    if (!destinations || !destinations.length) {
      throw new Error("At least one destination is required");
    }

    // If only one destination, use regular directions with origin as both start and end
    if (destinations.length === 1) {
      const response = await apiClient.get(config.google.directions.endpoint, {
        params: {
          origin,
          destination: origin, // Return to origin
          waypoints: destinations[0], // The single destination becomes a waypoint
          mode: config.google.directions.mode,
        },
      });

      if (response.data.status !== "OK") {
        throw new Error(`Directions API error: ${response.data.status}`);
      }

      return response.data;
    }

    // For multiple destinations:
    // Origin is also the final destination (circular route)
    // All destinations become waypoints to be optimized
    const finalDestination = origin;
    const waypoints = destinations;

    console.log(
      `Optimizing circular route from ${origin} through ${waypoints.length} stops and back`
    );

    const response = await apiClient.get(config.google.directions.endpoint, {
      params: {
        origin,
        destination: finalDestination,
        waypoints: `optimize:true|${waypoints.join("|")}`,
        mode: config.google.directions.mode,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error(`Directions API error: ${response.data.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error optimizing route:", error);
    throw error;
  }
};

/**
 * Format multi-leg route data for display
 * @param {Object} routeData - Google Directions API response with multiple legs
 * @returns {Object} - Formatted route data
 */
export const formatMultiDestinationRoute = (routeData) => {
  if (!routeData.routes || routeData.routes.length === 0) {
    return { error: "No routes found" };
  }

  const route = routeData.routes[0];
  const legs = route.legs;

  // Calculate total distance and duration
  let totalDistance = 0;
  let totalDuration = 0;
  legs.forEach((leg) => {
    totalDistance += leg.distance.value;
    totalDuration += leg.duration.value;
  });

  // Format duration in hours and minutes
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const formattedDuration =
    hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

  // Format distance in km
  const formattedDistance = `${(totalDistance / 1000).toFixed(1)} km`;

  return {
    totalDistance: formattedDistance,
    totalDuration: formattedDuration,
    startAddress: legs[0].start_address,
    endAddress: legs[legs.length - 1].end_address,
    legs: legs.map((leg) => ({
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map((step) => ({
        instructions: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text,
        maneuver: step.maneuver || "",
      })),
    })),
    waypointOrder: route.waypoint_order,
    polyline: route.overview_polyline.points,
  };
};
