import config from "../config/default.js";

// Simple logging levels
const LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Get current log level from config
const getCurrentLevel = () => {
  const configLevel = config.logging?.level?.toUpperCase() || "INFO";
  return LEVELS[configLevel] !== undefined ? LEVELS[configLevel] : LEVELS.INFO;
};

// Format the log message
const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

// Logger implementation
export const logger = {
  error: (message) => {
    if (getCurrentLevel() >= LEVELS.ERROR) {
      console.error(formatMessage("ERROR", message));
    }
  },

  warn: (message) => {
    if (getCurrentLevel() >= LEVELS.WARN) {
      console.warn(formatMessage("WARN", message));
    }
  },

  info: (message) => {
    if (getCurrentLevel() >= LEVELS.INFO) {
      console.info(formatMessage("INFO", message));
    }
  },

  debug: (message) => {
    if (getCurrentLevel() >= LEVELS.DEBUG) {
      console.debug(formatMessage("DEBUG", message));
    }
  },

  // Log HTTP request
  request: (req, res, next) => {
    if (getCurrentLevel() >= LEVELS.INFO) {
      const start = Date.now();

      // Log when the request completes
      res.on("finish", () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        console.info(formatMessage("REQUEST", message));
      });
    }
    next();
  },
};
