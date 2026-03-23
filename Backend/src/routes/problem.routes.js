const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const { isAdmin } = require("../middlewares/admin.middleware.js");
const {
  createproblem,
  getAllproblems,
  getproblemById,
  updateproblemById, // Imported new function
  deleteproblemById,
} = require("../controllers/problem.controller.js");

const router = Router();

// 🛡️ Admin Only Routes
router.route("/createproblem").post(verifyJWT, isAdmin, createproblem);

// Grouping the ID routes together for cleaner code
router
  .route("/:id")
  .get(getproblemById) // Public: Anyone can view a problem
  .put(verifyJWT, isAdmin, updateproblemById) // Admin: Update problem
  .delete(verifyJWT, isAdmin, deleteproblemById); // Admin: Delete problem

// Public Routes
router.route("/").get(getAllproblems);

module.exports = router;
