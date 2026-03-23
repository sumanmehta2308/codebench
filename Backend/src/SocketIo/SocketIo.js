const { Server } = require("socket.io");
const http = require("http");
const app = require("../app.js");
const redisClient = require("../db/redis"); // Redis import presence track karne ke liye

const createSocketServer = () => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", async (socket) => {
    // 🔹 Presence Logic: Mark User Online
    // Frontend se connection ke waqt query mein userId bhejna zaroori hai
    const userId = socket.handshake.query.userId; 
    
    if (userId) {
      // Redis hash "online_users" mein userId aur socketId store karna
      await redisClient.hSet("online_users", userId, socket.id);
      // Sabhi users ko batana ki ye user online aa gaya hai
      io.emit("user_presence", { userId, status: "online" });
      console.log(`User ${userId} is now online. Socket: ${socket.id}`);
    }

    console.log("User connected Socket ", socket.id);

    socket.on("disconnect", async () => {
      if (userId) {
        // Redis se user ko remove karna
        await redisClient.hDel("online_users", userId);
        // Sabhi ko notify karna ki user offline chala gaya
        io.emit("user_presence", { userId, status: "offline" });
        console.log(`User ${userId} disconnected.`);
      }
    });

    // --- Interview Room & Collaboration Events ---
    socket.on("create-room", (data) => {
      const { user, room } = data;
      socket.join(room);
      io.to(socket.id).emit("room:join", data);
      console.log(`Host ${user.fullname} created room- ${room}`);
    });

    socket.on("room:join_request", (data) => {
      const { user, room, id } = data;
      io.to(room).emit("user:requested_to_join", {
        user,
        id: socket.id,
        requser_id: id,
      });
    });

    socket.on("host:req_accepted", (data) => {
      const { requser_id } = data;
      io.to(requser_id).emit("room:join", data);
    });

    socket.on("code:change", (data) => {
      const { remoteSocketId } = data;
      io.to(remoteSocketId).emit("change:code", data);
    });

    socket.on("language:change", (data) => {
      const { remoteSocketId } = data;
      io.to(remoteSocketId).emit("change:language", data);
    });

    socket.on("question:change", (data) => {
      const { remoteSocketId } = data;
      io.to(remoteSocketId).emit("change:question", data);
    });

    socket.on("code:run", (data) => {
      const { remoteSocketId } = data;
      io.to(remoteSocketId).emit("run:code", data);
    });

    socket.on("user:call", (data) => {
      const { remoteSocketId, offer } = data;
      io.to(remoteSocketId).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, answer }) => {
      io.to(to).emit("call:accepted", { from: socket.id, answer });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.emit("welcome", "Welcome to the CodeBench Server!");
  });

  return server;
};

module.exports = createSocketServer;