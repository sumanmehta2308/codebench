const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  store: new RedisStore({
    // ✅ FIX: This wrapper prevents "ClientClosedError" during startup
    sendCommand: async (...args) => {
      if (!redisClient.isOpen) {
        try {
          await redisClient.connect();
        } catch (err) {
          // If it fails, the next line will throw a clean error instead of a crash
        }
      }
      return redisClient.sendCommand(args);
    },
    prefix: "cb_rate:",
    handleError: (err) => console.error("Redis RateLimit Conn Error:", err),
  }),

  windowMs: 2 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res
      .status(429)
      .json(new ApiResponse(429, null, "Too many requests. Please wait."));
  },

  keyGenerator: (req, res) => {
    if (req.user) {
      return req.user._id.toString();
    }
    // Fixes the IPv6 crash issue
    return rateLimit.ipKeyGenerator(req, res);
  },
});

module.exports = { codeExecutionLimiter };
