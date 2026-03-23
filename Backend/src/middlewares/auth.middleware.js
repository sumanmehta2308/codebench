const { User } = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
   // const token = req.cookies?.accessToken ||   req.header("Authorization")?.replace("Bearer ", "");
    //  console.log("COOKIE TOKEN:", req.cookies?.accessToken);
     // console.log("AUTH HEADER:", req.header("Authorization"));
   const token =
     req.cookies?.accessToken ||
     (req.header("Authorization") &&
       req.header("Authorization").startsWith("Bearer ") &&
       req.header("Authorization").replace("Bearer ", ""));
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //console.log("DECODED TOKEN:", decodedToken);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "INVALID ACCESS TOKEN");
    }
    req.user = user;
    next();
  } catch (error) {
    throw error;
  }
});

module.exports = { verifyJWT };
