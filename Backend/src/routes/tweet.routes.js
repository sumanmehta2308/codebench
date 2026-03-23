const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  createTweet,
  getAllTweets,
  getTweetsofProblem,
} = require("../controllers/tweets.controller.js");
const { upload } = require("../middlewares/multer.middleware.js");

const router = Router();

router
  .route("/createtweet")
  .post(verifyJWT, upload.single("image"), createTweet);
router.route("/").get(getAllTweets);
router.route("/problem/:id").get(getTweetsofProblem);

module.exports = router;
