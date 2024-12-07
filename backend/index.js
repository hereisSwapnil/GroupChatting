const connectDB = require("./db/index");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat: ${chatId}`);
  });

  socket.on("newMessage", (message) => {
    const chat = message.chat;
    if (!chat) return;
    
    io.to(chat).emit("messageReceived", message);
  });

  socket.on("typing", (data) => {
    const { chatId, userId, user_image } = data;
    socket.to(chatId).emit("typing", data);
  });

  socket.on("stopTyping", (data) => {
    const { chatId, userId, user_image  } = data;
    socket.to(chatId).emit("stopTyping", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    const HOST = '0.0.0.0';
    server.listen(PORT, HOST, () => {
      console.log(`Server is running 🚀 on http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });