// rateLimiter.middleware.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  store: new RedisStore({
    // ✅ Direct command use karo, reconnect logic server.js mein handle ho rahi hai
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 1000,
  max: 5, // 💡 Testing ke liye limit thodi badha di hai
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        new ApiResponse(429, null, "Too many requests. Please wait 15 seconds.")
      );
  },
  // rateLimiter.middleware.js
  keyGenerator: (req) => {
    // ✅ FIX: Remove the "rl:" prefix. The RedisStore adds it automatically.
    return req.user ? req.user._id.toString() : req.ip;
  },
});
module.exports = { codeExecutionLimiter };
