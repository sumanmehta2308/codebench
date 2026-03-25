// server.js
require("dotenv").config();
const cron = require("node-cron"); // ✅ Added node-cron
const connectDB = require("./db/index");
const redisClient = require("./db/redis");
const createSocketServer = require("./SocketIo/SocketIo");
const app = require("./app");

const server = createSocketServer(app);

// ✅ NEW: Redis Keep-Alive Function
const startRedisKeepAlive = () => {
  // This runs every day at 00:00 (Midnight)
  cron.schedule("0 0 * * *", async () => {
    try {
      if (redisClient.isOpen) {
        const status = await redisClient.ping();
        console.log(`Redis Keep-Alive (Midnight Ping): ${status}`);
      }
    } catch (err) {
      console.error("Redis Keep-Alive Ping Failed:", err.message);
    }
  });
  console.log("Redis Keep-Alive Task Scheduled for 00:00 Daily");
};

const startServer = async () => {
  try {
    // 1. Ensure Redis is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log(" Redis Connection Verified");
    }

    // 2. Connect to MongoDB
    await connectDB();
    console.log("MongoDB Connected");

    const port = process.env.PORT || 8000;

    // 3. Start the Server
    server.listen(port, "0.0.0.0", () => {
      console.log(` CodeBench Server running at: http://localhost:${port}`);

      // Start the Keep-Alive Job here
      startRedisKeepAlive();
    });
  } catch (err) {
    console.error(" Server startup failed:", err);
    process.exit(1);
  }
};
startServer();
