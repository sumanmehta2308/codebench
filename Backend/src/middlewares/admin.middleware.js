const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const isAdmin = asyncHandler(async (req, res, next) => {
  // req.user is populated by your verifyJWT middleware
  if (req.user?.role !== "ADMIN") {
    throw new ApiError(403, "Access Denied: Admin privileges required");
  }
  next();
});

module.exports = { isAdmin };
