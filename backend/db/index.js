const dotenv = require("dotenv");
const mongoose = require("mongoose");
const DB_NAME = require("../constants");

dotenv.config();

// Disable buffering to fail fast instead of timing out
mongoose.set('bufferCommands', false);

// Cache the connection promise to reuse across serverless invocations
let cachedConnection = null;

const connectDB = async () => {
  // If we have a cached connection and it's ready, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  // If connection is in progress, wait for it
  if (cachedConnection && mongoose.connection.readyState === 2) {
    console.log("Waiting for MongoDB connection in progress");
    return cachedConnection;
  }

  try {
    console.log("Establishing new MongoDB connection...");
    
    // Create connection with serverless-friendly options
    cachedConnection = await mongoose.connect(
      `${process.env.MONGO_URI}`,
      {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      }
    );
    
    console.log(`MongoDB connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    cachedConnection = null; // Clear cache on error
    throw error; // Re-throw to handle in calling code
  }
};

module.exports = connectDB;
