require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Redis connection failed");
      return Math.min(retries * 50, 2000);
    },
  },
});

redisClient.on("connect", () =>
  console.log("🔗 Network connected to Redis...")
);
redisClient.on("ready", () => console.log("✅ Redis authenticated and ready!"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));

// Note: Connection is handled in server.js to ensure order
module.exports = redisClient;
