const asyncHandler = require("../utils/asyncHandler");
const { validateCode } = require("../middlewares/validatecode.middleware");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");
const cleanInput = (str) => {
  if (!str) return "";
  const numbers = str.match(/-?\d+/g);
  return numbers ? numbers.join(" ") : "";
};

 // 1. RUN CODE (Custom Input)
const runCode = asyncHandler(async (req, res) => {
  console.log(`[RUN_CODE] User ${req.user?._id} triggered execution.`);
  const { language, code, input } = req.body;
  try {
    const sanitizedInput = cleanInput(input);
    const response = await axios.post(
      `${process.env.JUDGE0_URL}/execute`,
      { language, code, input: sanitizedInput },
      { timeout: 30000 }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, response.data.output, "Executed Successfully")
      );
  } catch (error) {
    console.error(" RUN_CODE_ERROR:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, error.message, "Execution Error"));
  }
});

/*
  2. RUN EXAMPLE CASES (The 'Run' Button)
   FIXED: Removed Promise.all() to prevent 429 Rate Limiting
 */
const run_example_cases = asyncHandler(async (req, res) => {
  console.log(
    `🚀 [RUN_EXAMPLES] User ${req.user?._id} triggered example cases.`
  );
  const { language, code, example_cases } = req.body;

  try {
    validateCode(language, code);

    if (!example_cases || example_cases.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No example cases provided"));
    }

    const res_output = [];

    //  Sequential Execution: Wait for each test case to finish
    for (const testCase of example_cases) {
      try {
        const sanitizedInput = cleanInput(testCase.input);
        const resp = await axios.post(
          `${process.env.JUDGE0_URL}/execute`,
          { language, code, input: sanitizedInput },
          { timeout: 30000 }
        );

        const actualOutput = (resp.data.output || "")
          .toString()
          .replace(/\r/g, "")
          .trim();
        const expectedOutput = (testCase.output || "")
          .toString()
          .replace(/\r/g, "")
          .trim();

        res_output.push({
          input: testCase.input,
          expectedOutput,
          actualOutput,
          isMatch: actualOutput === expectedOutput,
        });
      } catch (err) {
        res_output.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput:
            "Runtime Error: " + (err.response?.data?.error || err.message),
          isMatch: false,
        });
      }
    }

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
 * 🛠️ FIXED: Removed Promise.allSettled() to prevent 429 Rate Limiting
 */
const runtestcases = asyncHandler(async (req, res) => {
  console.log(
    `[SUBMIT_CODE] User ${req.user?._id} submitting problem ${req.body.problem_id}.`
  );
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

    // 🔥 Sequential Execution: Crucial for Judge0 stability on Render
    for (const testCase of problem.test_cases) {
      try {
        const sanitizedInput = cleanInput(testCase.input);
        const resp = await axios.post(
          `${process.env.JUDGE0_URL}/execute`,
          { language, code, input: sanitizedInput },
          { timeout: 30000 }
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
          isSuccess = false;
          failedTestCase = {
            input: testCase.input,
            actualOutput,
            expectedOutput,
            status: "Wrong Answer",
          };
          break; // Stop checking after first failure to save resources
        }
      } catch (err) {
        isSuccess = false;
        failedTestCase = {
          input: "Hidden Test Case",
          status: "Runtime Error",
          error: err.response?.data?.error || err.message,
        };
        break; // Stop checking after first failure
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
    console.error(" SUBMISSION_CONTROLLER_ERROR:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to process test cases"));
  }
});

module.exports = { runCode, run_example_cases, runtestcases };
