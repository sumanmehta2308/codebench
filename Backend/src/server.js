// server.js
require("dotenv").config();
const connectDB = require("./db/index");
const redisClient = require("./db/redis"); // This pulls in your updated redis.js
const createSocketServer = require("./SocketIo/SocketIo");
const app = require("./app");

const server = createSocketServer(app);

const startServer = async () => {
  try {
    // 1. Ensure Redis is connected before proceeding
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis Connection Verified");
    }

    // 2. Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");

    const port = process.env.PORT || 8000;

    // 3. Start the Server
    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 CodeBench Server running at: http://localhost:${port}`);
      // Log the Judge URL to confirm which environment we are in
      console.log(`📡 Targeting Judge Service: ${process.env.JUDGE0_URL}`);
    });
  } catch (err) {
    console.error("💥 Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
