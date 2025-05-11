export const validateRouteInput = (req, res, next) => {
  const { origin } = req.body;
  let destinations = [];

  // Check for destinations in different formats
  if (req.body["destinations[]"]) {
    if (Array.isArray(req.body["destinations[]"])) {
      destinations = req.body["destinations[]"];
    } else {
      destinations = [req.body["destinations[]"]];
    }
  } else if (Array.isArray(req.body.destinations)) {
    destinations = req.body.destinations;
  } else if (req.body.destination) {
    destinations = [req.body.destination];
  }

  // Validate origin
  if (!origin || origin.trim() === "") {
    return res.render("error", {
      title: "Validation Error",
      error: "Starting point is required",
      stack: null,
    });
  }

  // Validate destinations
  if (!destinations.length) {
    return res.render("error", {
      title: "Validation Error",
      error: "At least one destination is required",
      stack: null,
    });
  }

  // Validate each destination is not empty
  const emptyDestinations = destinations.filter(
    (dest) => !dest || dest.trim() === ""
  );
  if (emptyDestinations.length > 0) {
    return res.render("error", {
      title: "Validation Error",
      error: "All destinations must have valid addresses",
      stack: null,
    });
  }

  // Add validated data to request object
  req.validatedData = {
    origin,
    destinations,
  };

  next();
};
