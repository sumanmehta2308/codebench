const Contest = require("../models/contest.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createContest = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, problems } = req.body;

  if ([title, startTime, endTime].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const contest = await Contest.create({
    title,
    description,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    problems,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, contest, "Contest scheduled successfully"));
});

const getActiveContests = asyncHandler(async (req, res) => {
  const now = new Date();
  // Find contests where now is before endTime
  const contests = await Contest.find({
    endTime: { $gte: now },
  }).sort({ startTime: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, contests, "Active contests fetched"));
});

module.exports = { createContest, getActiveContests };
