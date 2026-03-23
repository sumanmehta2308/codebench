const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  getMySubmissions,
  getSuccessfullySolvedProblems,
  createSubmission,
} = require("../controllers/submissions.controller.js");

const router = Router();
router.post("/submit", verifyJWT, createSubmission);
router.route("/").post(verifyJWT, getMySubmissions);
router.route("/").get(verifyJWT, getSuccessfullySolvedProblems);

module.exports = router;
