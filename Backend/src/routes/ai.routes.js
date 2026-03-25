const express = require("express");
const { askAiTutor } = require("../controllers/ai.controller");
const { verifyJWT } = require("../middlewares/auth.middleware.js"); // ✅ Added
const {
  codeExecutionLimiter,
} = require("../middlewares/rateLimiter.middleware.js"); // ✅ Added
const router = express.Router();

// ✅ Added protection so only logged-in users can ask the AI, with a rate limit
router.post("/chat", verifyJWT, codeExecutionLimiter, askAiTutor);

module.exports = router;
