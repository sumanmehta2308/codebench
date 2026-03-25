const asyncHandler = require("../utils/asyncHandler");
const {
  validateCode,
  validateInput,
} = require("../middlewares/validatecode.middleware");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");
const redisClient = require("../db/redis");

/**
 * HELPER: cleanInput
 */
const cleanInput = (str) => {
  if (!str) return "";
  return str
    .replace(/[a-zA-Z=,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * 1. RUN CODE (Custom Input)
 */
const runCode = asyncHandler(async (req, res) => {
  const { language, code, input } = req.body;
  const userId = req.user?._id.toString();

  const rateLimitKey = `rl:${userId}:run`;
  const isLocked = await redisClient.get(rateLimitKey);

  if (isLocked) {
    return res.status(429).json(
      new ApiResponse(429, null, "You can try again after 1 minute.")
    );
  }
 console.log("📡 Sending request to Judge at:", process.env.JUDGE0_URL);
  try {
    const sanitizedInput = cleanInput(input);
    await redisClient.setEx(rateLimitKey, 60, "true");

    const response = await axios.post(
      `${process.env.JUDGE0_URL}/execute`,
      { language, code, input: sanitizedInput },
      { timeout: 15000 }
    );

    return res.status(200).json(new ApiResponse(200, response.data.output, "Executed Successfully"));
  } catch (error) {
    console.error("RUN_CODE_ERROR:", error.message);
    return res.status(500).json(new ApiResponse(500, error.message, "Execution Error"));
  }
});

/**
 * 2. RUN EXAMPLE CASES (The 'Run' Button)
 */
const run_example_cases = asyncHandler(async (req, res) => {
  const { language, code, example_cases } = req.body;

  try {
    validateCode(language, code);

    if (!example_cases || example_cases.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No example cases provided"));
    }

    const res_output = await Promise.all(
      example_cases.map(async (testCase) => {
        try {
          const sanitizedInput = cleanInput(testCase.input);
          const resp = await axios.post(
            `${process.env.JUDGE0_URL}/execute`,
            {
              language,
              code,
              input: sanitizedInput,
            },
            { timeout: 15000 }
          );

          const actualOutput = (resp.data.output || "")
            .toString()
            .replace(/\r/g, "")
            .trim();

          const expectedOutput = (testCase.output || "")
            .toString()
            .replace(/\r/g, "")
            .trim();

          return {
            input: testCase.input,
            expectedOutput,
            actualOutput,
            isMatch: actualOutput === expectedOutput,
          };
        } catch (err) {
          return {
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput:
              "Runtime Error: " + (err.response?.data?.error || err.message),
            isMatch: false,
          };
        }
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, res_output, "Example cases executed successfully")
      );
  } catch (error) {
    console.error("EXAMPLE_CASES_ERROR:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server error"));
  }
});

/**
 * 3. RUN TEST CASES (The 'Submit' Button)
 */
const runtestcases = asyncHandler(async (req, res) => {
  const { language, problem_id, code } = req.body;

  try {
    validateCode(language, code);

    const problem = await Problem.findById(problem_id).select("test_cases");
    if (!problem) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Problem not found"));
    }

    let failedTestCase = null;
    let isSuccess = true;

    for (const testCase of problem.test_cases) {
      try {
        const sanitizedInput = cleanInput(testCase.input);

        // ✅ FIXED: Using process.env.JUDGE0_URL instead of hardcoded 'code-judge'
        const resp = await axios.post(
          `${process.env.JUDGE0_URL}/execute`,
          {
            language,
            code,
            input: sanitizedInput,
          },
          { timeout: 15000 }
        );

        const actualOutput = (resp.data.output || "")
          .toString()
          .replace(/\r/g, "")
          .trim();

        const expectedOutput = testCase.output
          .toString()
          .replace(/\r/g, "")
          .trim();

        if (actualOutput !== expectedOutput) {
          failedTestCase = {
            input: testCase.input,
            actualOutput,
            expectedOutput,
            status: "Wrong Answer",
          };
          isSuccess = false;
          break;
        }
      } catch (err) {
        isSuccess = false;
        failedTestCase = {
          input: testCase.input,
          status: "Runtime Error",
          error: err.response?.data?.error || err.message,
        };
        break;
      }
    }

    await Submission.create({
      problem: problem_id,
      madeBy: req.user._id,
      status: isSuccess,
      code,
      language,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: isSuccess, data: failedTestCase },
          isSuccess ? "Accepted" : "Rejected"
        )
      );
  } catch (error) {
    console.error("SUBMISSION_CONTROLLER_ERROR:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to process test cases"));
  }
});

module.exports = { runCode, run_example_cases, runtestcases };