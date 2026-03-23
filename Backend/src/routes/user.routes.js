const { Router } = require("express");
const { upload } = require("../middlewares/multer.middleware.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  getCurrentUser,
  gettemplateandlang,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  setdefaultlang,
  settemplate,
  updateAvatar,
} = require("../controllers/user.controller.js");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// SECURED ROUTES
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/getcurrentuser").get(verifyJWT, getCurrentUser);
router
  .route("/updateavatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/updatedefaultlang/:lang").post(verifyJWT, setdefaultlang);
router.route("/updatetemplate/:lang").post(verifyJWT, settemplate);
router.route("/getdeflangandtemplate").get(verifyJWT, gettemplateandlang);
module.exports = router;