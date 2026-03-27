require("dotenv").config();
const { createClient } = require("redis");

// FIX: This URL format is REQUIRED for RedisLabs to connect properly.
// Notice the empty space between // and : (this sends a blank username)
const redisUrl = `redis://:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = createClient({
  url: redisUrl,
  socket: {
    // Fail faster so your server doesn't hang forever
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis reconnect strategy failed after 5 attempts.");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 500, 2000);
    },
  },
});

redisClient.on("connect", () =>
  console.log("🔗 Network connected to Redis...")
);
redisClient.on("ready", () => console.log("✅ Redis authenticated and ready!"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));

module.exports = redisClient;
