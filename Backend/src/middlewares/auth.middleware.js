const { User } =require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // STRONGER TOKEN EXTRACTION: Prioritize Header for Vercel/Render compatibility
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized Request: Please Log In");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // We only need the ID for validation, no need to pull the whole user object yet to save DB queries
    const user = await User.findById(decodedToken?._id).select(
      "_id role username"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // If token expires, send a specific 401 so frontend knows to refresh
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Token Expired",
        code: "TOKEN_EXPIRED",
      });
    } else {
      throw new ApiError(401, error?.message || "Invalid Token");
    }
  }
});
module.exports = { verifyJWT };
