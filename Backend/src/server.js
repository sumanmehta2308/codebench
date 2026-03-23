require("dotenv").config();
const express = require("express");
const connectDB = require("./db/index");
const redisClient = require("./db/redis");
const createSocketServer = require("./SocketIo/SocketIo");
const axios = require("axios");
const cors = require("cors");
const app = express();

// 💡 DEBUG: Add this to verify your Docker Compose envs are hitting the app
console.log("🚀 JUDGE0_URL set to:", process.env.JUDGE0_URL);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.post("/execute", async (req, res) => {
  try {
    // In Docker Compose, this should resolve to http://code-judge:7001/execute
    const response = await axios.post(
      `${process.env.JUDGE0_URL}/execute`,
      req.body,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 5000, // 💡 Add a timeout so the request doesn't hang forever
      }
    );
    res.json(response.data);
  } catch (err) {
    // Detailed logging to see if it's a 404, 500, or Connection Refused
    console.error("❌ Judge error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      error: "Execution failed",
      details: err.message,
    });
  }
});

const server = createSocketServer(app);

const startServer = async () => {
  try {
    // 💡 Priority 1: Redis Connect pehle karein
    if (!redisClient.isOpen) {
      // 💡 Ensure your Redis URL is also using the service name 'codebench-redis'
      await redisClient.connect();
      console.log("🔴 Redis connected for Rate Limiting & Presence");
    }
    // Priority 2: Database Connect karein
    await connectDB();
    const port = process.env.PORT || 8000;
    server.listen(port, "0.0.0.0", () => {
      console.log(`⚙️ Server is running at port : ${port}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
