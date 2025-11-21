const connectDB = require("../db/index");

/**
 * Middleware to ensure MongoDB connection is established before processing requests
 * This is critical for serverless environments where connections may not persist
 */
const ensureDBConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({ 
      message: "Database connection unavailable. Please try again.",
      error: error.message 
    });
  }
};

module.exports = ensureDBConnection;
