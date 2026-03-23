const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const { isAdmin } = require("../middlewares/admin.middleware.js");
const {
  createContest,
  getActiveContests,
} = require("../controllers/contest.controller.js");

const router = Router();

router.route("/create").post(verifyJWT, isAdmin, createContest);
router.route("/active").get(getActiveContests);

module.exports = router;
