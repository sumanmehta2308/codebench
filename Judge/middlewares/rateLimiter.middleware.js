const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redisClient = require("../db/redis");

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
    prefix: "judge_rate:", // Unique prefix for judge
  }),

  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Higher limit for batch test cases
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "Too many execution requests. Please wait a minute.",
    });
  },

  keyGenerator: (req, res) => {
    // Falls back to IP. app.set("trust proxy", 1) in index.js makes this work on Render.
    return req.ip;
  },
});

module.exports = { codeExecutionLimiter };
