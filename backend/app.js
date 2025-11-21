const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();

// Allow multiple origins for CORS
const allowedOrigins = [
  process.env.ORIGIN,
  // dev
  'http://192.168.32.247:5173',
  'http://localhost:5173'
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Ensure database connection before processing API requests
const ensureDBConnection = require("./middlewares/dbConnection");
app.use("/api", ensureDBConnection);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const userRouter = require("./routes/user.routes");
app.use("/api/user", userRouter);
const chatRouter = require("./routes/chat.routes");
app.use("/api/chat", chatRouter);
const messageRouter = require("./routes/message.routes");
app.use("/api/message", messageRouter);

const { notFound, errorHandler } = require("./middlewares/error");

app.use(notFound);
app.use(errorHandler);

module.exports = app;
