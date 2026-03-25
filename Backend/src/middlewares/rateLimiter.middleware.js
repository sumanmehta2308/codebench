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
  windowMs: 15 * 1000, // 💡 Reduced to 15 seconds for much better UX
  max: 3, // Allow 3 rapid clicks before blocking
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
    // 💡 CRITICAL FIX: Only limit by User ID. If no user, give them a random key so they don't block others
    return req.user ? `rl:${req.user._id}` : `rl:anon:${Math.random()}`;
  },
});

module.exports = { codeExecutionLimiter };
