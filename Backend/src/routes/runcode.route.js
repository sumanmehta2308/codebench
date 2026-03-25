const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  codeExecutionLimiter,
} = require("../middlewares/rateLimiter.middleware.js");
const {
  run_example_cases,
  runCode,
  runtestcases,
} = require("../controllers/runcode.controller.js");

const router = Router();

// 💡 Rate Limiter added before controllers
router.route("/").post(verifyJWT, codeExecutionLimiter, runCode);
router
  .route("/runexamplecases")
  .post(verifyJWT, codeExecutionLimiter, run_example_cases);
router.route("/submitcode").post(verifyJWT, codeExecutionLimiter, runtestcases);

module.exports = router;
