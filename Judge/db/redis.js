const redis = require("redis");

const redisClient = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.error("Judge Redis Error:", err));

// Initial connection for the Judge Service
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Judge Service connected to Redis");
    }
  } catch (err) {
    console.error("Judge Redis Connection Failed:", err);
  }
})();

module.exports = redisClient;
