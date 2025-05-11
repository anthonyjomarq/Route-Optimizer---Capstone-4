// routes/index.js
import express from "express";
import * as indexController from "../controllers/indexController.js";
import * as routeController from "../controllers/routeController.js";
import { validateRouteInput } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Log all requests
router.use(logger.request);

// Home page route
router.get("/", indexController.displayHomePage);

// Route calculation route with validation middleware
router.post("/route", validateRouteInput, routeController.calculateRoute);

export default router;
