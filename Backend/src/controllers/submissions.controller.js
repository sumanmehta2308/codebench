const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const getMySubmissions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // 💡 BUG FIX 1: Check both body and query for problem_id to ensure it's always caught
  const problem_id = req.body.problem_id || req.query.problem_id;

  // 💡 BUG FIX 2: Safely convert the user ID to a string before wrapping it in ObjectId
  // to prevent Mongoose BSONTypeErrors
  let match = { madeBy: new mongoose.Types.ObjectId(req.user._id.toString()) };

  if (problem_id && mongoose.Types.ObjectId.isValid(problem_id)) {
    match.problem = new mongoose.Types.ObjectId(problem_id);
  }

  // 💡 BUG FIX 3: Calculate total count to enable accurate pagination on the frontend
  const totalCount = await Submission.countDocuments(match);
  const totalPages = Math.ceil(totalCount / limit);

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
    { $sort: { createdAt: -1 } }, // Ensures the newest submission is always at the top
    { $skip: skip },
    { $limit: limit },
  ]);

  // 💡 BUG FIX 4: Return an Object { submissions, totalPages } instead of a raw array.
  // This matches your Submissions.jsx frontend condition perfectly!
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        submissions,
        totalPages,
        currentPage: page,
        totalCount,
      },
      "Submissions fetched Successfully"
    )
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
