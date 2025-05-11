import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/default.js";
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";
import { logger } from "./utils/logger.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logging middleware
app.use(logger.request);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", indexRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("Request body:", req.body);
  }
  next();
});

// Error handling middleware (will create later)
// app.use(errorHandler);

export default app;
