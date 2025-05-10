const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log error details
  console.error(`Error ${statusCode}: ${err.message}`);

  // Send user-friendly response
  res.status(statusCode).render("error", {
    title: "Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
