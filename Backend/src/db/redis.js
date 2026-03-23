require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    // 💡 FIX: Docker network ke liye hum environment variable use karenge
    host: process.env.REDIS_HOST || "codebench-redis", 
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on("connect", () => console.log("🔗 Network connected to Redis..."));
redisClient.on("ready", () => console.log("✅ Redis authenticated and ready to use!"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));

module.exports = redisClient;