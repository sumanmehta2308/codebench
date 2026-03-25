const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const getMySubmissions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const { problem_id } = req.body;

  let match = { madeBy: new mongoose.Types.ObjectId(req.user._id) };

  if (problem_id && mongoose.Types.ObjectId.isValid(problem_id)) {
    match.problem = new mongoose.Types.ObjectId(problem_id);
  }

  const submissions = await Submission.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "problems",
        localField: "problem",
        foreignField: "_id",
        as: "problem",
        pipeline: [{ $project: { _id: 1, title: 1, difficulty: 1 } }],
      },
    },
    { $addFields: { problem: { $first: "$problem" } } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched Successfully")
    );
});

const getSuccessfullySolvedProblems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const solvedProblems = await Submission.aggregate([
      { $match: { madeBy: req.user._id, status: true } },
      { $group: { _id: "$problem" } },
      {
        $lookup: {
          from: "problems",
          localField: "_id",
          foreignField: "_id",
          as: "problemDetails",
          pipeline: [{ $project: { title: 1, _id: 1 } }],
        },
      },
      { $unwind: "$problemDetails" },
      { $project: { _id: 0, problem: "$problemDetails" } },
      { $skip: skip },
      { $limit: limit },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, solvedProblems, "Solved Problems Fetched"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, [], "Server Error"));
  }
});

const createSubmission = asyncHandler(async (req, res) => {
  const { problem_id, code, language } = req.body;

  // 💡 REMOVED MANUAL 20-SEC COOLDOWN. The Express Rate Limiter handles this globally now.

  const submission = await Submission.create({
    problem: problem_id,
    madeBy: req.user._id,
    code,
    language,
    status: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submission, "Submitted successfully"));
});

module.exports = {
  getMySubmissions,
  getSuccessfullySolvedProblems,
  createSubmission,
};
