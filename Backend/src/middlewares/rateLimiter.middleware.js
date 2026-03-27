const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => {
      if (!redisClient.isOpen) {
        try {
          await redisClient.connect();
        } catch (err) {}
      }
      return redisClient.sendCommand(args);
    },
    prefix: "cb_rate:",
    handleError: (err) => console.error("Redis RateLimit Conn Error:", err),
  }),

  // 🛡️ FIX: 30-second window per your request
  windowMs: 30 * 1000,
  // Allow a maximum of 2 clicks per 30 seconds
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Please wait 30 seconds before running code again."
        )
      );
  },

  keyGenerator: (req, res) => {
    if (req.user) return req.user._id.toString();
    return rateLimit.ipKeyGenerator(req, res);
  },
});

module.exports = { codeExecutionLimiter };
