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
    console.log("Starting server initialization sequence...");
    if (!redisClient.isOpen) {
      console.log("Attempting to connect to Redis...");
      await redisClient.connect();
    }
    await connectDB();
    console.log(" MongoDB Connected Successfully");

    const port = process.env.PORT || 8000;

    server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
     //startRedisKeepAlive();
    });
  } catch (err) {
    console.error(" Startup failed:", err);
    process.exit(1);
  }
};

// Handle unexpected errors
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  // Don't kill the server, just log it
});
startServer();
