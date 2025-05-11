import config from "../config/default.js";
import { logger } from "../utils/logger.js";

/**
 * Display the home page
 */
export const displayHomePage = (req, res) => {
  logger.info("Displaying home page");

  res.render("index", {
    title: "Route Optimizer",
    provider: "Google Maps",
    apiKey: config.api.key,
  });
};
