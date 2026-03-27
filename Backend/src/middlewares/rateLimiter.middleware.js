const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");
const { ApiResponse } = require("../utils/ApiResponse");

const codeExecutionLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "cb_rate:",
    handleError: (err) => console.error("Redis RateLimit Conn Error:", err),
  }),

  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 10, // 10 attempts per window

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    console.log(`[Rate Limiter] Blocked: ${req.user ? req.user._id : req.ip}`);
    res
      .status(429)
      .json(new ApiResponse(429, null, "Too many requests. Please wait."));
  },

  // ✅ FIX CRASH: Uses the internal helper to handle IPv6 correctly
  keyGenerator: (req, res) => {
    if (req.user) {
      return req.user._id.toString();
    }
    return rateLimit.ipKeyGenerator(req, res);
  },
});

module.exports = { codeExecutionLimiter };
