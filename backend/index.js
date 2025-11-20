const connectDB = require("./db/index");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");

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
    if (!chat) {
      console.log("newMessage received without chat ID:", message);
      return;
    }
    
    console.log(`Broadcasting message to room: ${chat}`);
    io.to(chat).emit("messageReceived", message);
    io.emit("messageChannel", message);
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
      // Get network interfaces
      const networkInterfaces = os.networkInterfaces();
      const addresses = [];
      
      // Find IPv4 addresses
      for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
          // Skip internal (loopback) and non-IPv4 addresses
          if (iface.family === 'IPv4' && !iface.internal) {
            addresses.push(iface.address);
          }
        }
      }
      
      console.log(`\n🚀 Server is running on:\n`);
      console.log(`  ➜ Local:    http://localhost:${PORT}`);
      
      if (addresses.length > 0) {
        addresses.forEach(address => {
          console.log(`  ➜ Network:  http://${address}:${PORT}`);
        });
      }
      console.log('');
    });
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });