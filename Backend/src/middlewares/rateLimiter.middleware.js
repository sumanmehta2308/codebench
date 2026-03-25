const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  store: new RedisStore({
    // ✅ FIXED: Using the standard call format for Redis v4+
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        new ApiResponse(429, null, "Too many requests. Please wait 15 seconds.")
      );
  },
  keyGenerator: (req) => {
    // ✅ FIXED: Use IP address if User ID is missing to prevent random key spam
    return req.user ? `rl:${req.user._id}` : `rl:ip:${req.ip}`;
  },
});

module.exports = { codeExecutionLimiter };
