const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model"); // ✅ ADDED: Required for the solved filter
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError"); // ✅ ADDED: Required for error throwing
const asyncHandler = require("../utils/asyncHandler");

const createproblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    constraints,
    example_cases,
    test_cases,
    solution,
    input_format,
    output_format,
  } = req.body;
  const problem = new Problem({
    title,
    description,
    difficulty,
    constraints,
    example_cases,
    test_cases,
    solution,
    input_format,
    output_format,
  });
  const savedProblem = await problem.save();
  if (!savedProblem)
    return res.status(500).json(new ApiResponse(500, null, "Server Error"));
  return res
    .status(200)
    .json(new ApiResponse(200, savedProblem, "Problem created successfully"));
});

const getAllproblems = asyncHandler(async (req, res) => {
  // 1. Get params from query string
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const difficultyFilter = req.query.difficulty;

  // 2. Build the Match Object for filtering
  let matchQuery = {};

  if (difficultyFilter === "solved") {
    // Check if user is logged in
    if (!req.user) {
      throw new ApiError(401, "Please login to see solved problems"); // Now ApiError works
    }

    // 💡 Find IDs of problems the user has successfully submitted
    const solvedProblemIds = await Submission.find({
      madeBy: req.user._id, // FIXED: Changed userId to madeBy to match your submission model schema!
      status: true, // FIXED: Changed "Accepted" to boolean true based on your runcode controller!
    }).distinct("problem"); // FIXED: Changed "problemId" to "problem" based on your submission model!

    // Filter problems to only show those specific IDs
    matchQuery._id = { $in: solvedProblemIds };
  } else if (difficultyFilter && difficultyFilter !== "all") {
    // Filter by difficulty (Easy, Medium, Hard)
    matchQuery.difficulty = {
      $regex: new RegExp(`^${difficultyFilter}$`, "i"),
    };
  }

  // 3. Aggregate Data
  const problems = await Problem.aggregate([
    {
      $match: matchQuery,
    },
    {
      $addFields: {
        sortOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$difficulty", "easy"] }, then: 1 },
              { case: { $eq: ["$difficulty", "medium"] }, then: 2 },
              { case: { $eq: ["$difficulty", "hard"] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    },
    { $sort: { sortOrder: 1 } },
    {
      $project: {
        title: 1,
        difficulty: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  // 4. Get total count for pagination
  const totalCount = await Problem.countDocuments(matchQuery);
  const totalPages = Math.ceil(totalCount / limit);

  // 5. Return structured response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        problems,
        totalPages,
        totalCount,
        currentPage: page,
      },
      "Problems retrieved successfully"
    )
  );
});

const getproblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await Problem.findById(id);

  if (!problem)
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Problem not found"));
  return res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem retrieved successfully"));
});

const updateproblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedProblem = await Problem.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProblem) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Problem not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProblem, "Problem updated successfully"));
});

const deleteproblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const problem = await Problem.findByIdAndDelete(id);
  if (!problem)
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Problem not found"));
  return res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem Deleted successfully"));
});

module.exports = {
  createproblem,
  getproblemById,
  getAllproblems,
  updateproblemById,
  deleteproblemById,
};
