import config from "../config/default.js";
import * as routeService from "../services/routeService.js";
import { logger } from "../utils/logger.js";

/**
 * Process route optimization request
 */
export const calculateRoute = async (req, res) => {
  try {
    // Get validated data from middleware
    const { origin, destinations } = req.validatedData || req.body;

    logger.info(
      `Calculating route from ${origin} to ${destinations.length} destinations`
    );

    // Get route data based on number of destinations
    let routeData, formattedData;

    if (destinations.length === 1) {
      // Single destination
      const destination = destinations[0];
      logger.info(`Single destination route: ${origin} to ${destination}`);

      routeData = await routeService.getDirections(origin, destination);
      formattedData = routeService.formatRouteData(routeData);

      logger.info(
        `Route calculated: ${formattedData.distance}, ${formattedData.duration}`
      );

      res.render("result", {
        title: "Optimized Route",
        routeData: formattedData,
        apiKey: config.api.key,
        origin,
        destination,
        destinations: JSON.stringify(destinations),
        isMultiDestination: false,
        saveToHistory: true,
      });
    } else {
      // Multiple destinations - use optimization
      logger.info(
        `Multi-destination route: ${origin} to ${destinations.join(", ")}`
      );

      routeData = await routeService.getOptimizedRoute(origin, destinations);
      formattedData = routeService.formatMultiDestinationRoute(routeData);

      logger.info(
        `Route optimized: ${formattedData.totalDistance}, ${formattedData.totalDuration}, ${formattedData.legs.length} legs`
      );

      res.render("result", {
        title: "Optimized Route",
        routeData: formattedData,
        apiKey: config.api.key,
        origin,
        destination: destinations[destinations.length - 1],
        destinations: JSON.stringify(destinations),
        isMultiDestination: true,
        saveToHistory: true,
      });
    }
  } catch (error) {
    logger.error(`Route calculation error: ${error.message}`);
    logger.debug(error.stack);

    res.render("error", {
      title: "Error",
      error: error.message || "Failed to calculate route",
      stack: process.env.NODE_ENV === "development" ? error.stack : null,
    });
  }
};

export const displaySharedRoute = (req, res) => {
  try {
    const origin = req.query.origin;
    const destinations = Array.isArray(req.query.dest)
      ? req.query.dest
      : [req.query.dest];

    if (!origin || !destinations || destinations.length === 0) {
      throw new Error("Missing route parameters");
    }

    logger.info(
      `Loading shared route: Origin=${origin}, Destinations=${destinations.join(
        ", "
      )}`
    );

    res.render("shared-route", {
      title: "Shared Route",
      provider: "Google Maps",
      apiKey: config.api.key,
      origin,
      destinations,
    });
  } catch (error) {
    logger.error(`Shared route error: ${error.message}`);
    res.render("error", {
      title: "Error",
      error: "Unable to load shared route. " + error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : null,
    });
  }
};
