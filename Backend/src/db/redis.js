// redis.js
require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  // Only use 'default' if it's actually required by your provider,
  // otherwise, many Cloud providers just need the password.
  password: process.env.REDIS_PASS,
  socket: {
    // Priority 1: Cloud Host from .env
    // Priority 2: Docker service name "redis"
    host: process.env.REDIS_HOST || "redis",
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10)
        return new Error("Redis connection failed after 10 attempts");
      return Math.min(retries * 50, 2000);
    },
  },
});

redisClient.on("connect", () =>
  console.log("🔗 Network connected to Redis...")
);
redisClient.on("ready", () =>
  console.log("✅ Redis authenticated and ready to use!")
);
redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));

// Connection handler
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("❌ Redis connection failed:", err.message);
  }
};
connectRedis();
module.exports = redisClient;
