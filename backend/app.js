const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

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
