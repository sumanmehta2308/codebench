require("dotenv").config();
const cron = require("node-cron");
const connectDB = require("./db/index");
const redisClient = require("./db/redis");
const createSocketServer = require("./SocketIo/SocketIo");
const app = require("./app");

const server = createSocketServer(app);

const startRedisKeepAlive = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      if (redisClient.isOpen) {
        const status = await redisClient.ping();
        console.log(`Redis Keep-Alive: ${status}`);
      }
    } catch (err) {
      console.error("Redis Keep-Alive Failed:", err.message);
    }
  });
};

const startServer = async () => {
  try {
    // 1. Connect Redis first (Rate limiter depends on this!)
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis Connected");
    }

    // 2. Connect MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");

    const port = process.env.PORT || 8000;

    // 3. Start Server (Removed "0.0.0.0" to let Render handle binding)
    server.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
      startRedisKeepAlive();
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

// Handle unexpected errors
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  // Don't kill the server, just log it
});

startServer();
