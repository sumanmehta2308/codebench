const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      return redisClient.sendCommand(args);
    },
  }),
  windowMs: 1 * 60 * 1000, // 1 Minute
  max: 5,
  // 💡 FIX: Yeh line us lamba IPv6 error/warning ko rokti hai
  validate: {
    default: false,
    xForwardedForHeader: false,
  },
  handler: (req, res) => {
    res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Too many requests. Please try again after 1 minute."
        )
      );
  },
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
});

module.exports = { codeExecutionLimiter };
