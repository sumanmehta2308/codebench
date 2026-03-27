// rateLimiter.middleware.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  // 1. Configure the Redis Store properly
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    //  FIX: Explicitly set a custom prefix to stop the 'rl:rl:' bug
    prefix: "cb_rate:",
    handleError: (err) => console.error("Redis RateLimit Conn Error:", err),
  }),

  // 2. TEMPORARY FIX: Set to 2 minutes so you can see it in Workbench!
  // Change this back to 15 * 1000 after you verify it works.
  windowMs: 2* 60 * 1000,

  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  // 3. Keep trustProxy for Render
  validate: { trustProxy: true },

  handler: (req, res) => {
    console.log(
      `[Rate Limiter] Blocked User/IP: ${req.user ? req.user._id : req.ip}`
    );
    res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Too many requests. Please wait before submitting again."
        )
      );
  },

  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
});

module.exports = { codeExecutionLimiter };
