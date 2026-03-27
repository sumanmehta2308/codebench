const asyncHandler = require("../utils/asyncHandler");
const { validateCode } = require("../middlewares/validatecode.middleware");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");

// Cleans input
const cleanInput = (str) => {
  if (!str) return "";
  const numbers = str.match(/-?\d+/g);
  return numbers ? numbers.join(" ") : "";
};

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ FIXED: stronger retry + better backoff
const executeCodeWithRetry = async (language, code, input, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        `${process.env.JUDGE0_URL}/execute`,
        { language, code, input },
        {
          timeout: 60000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429 && i < retries - 1) {
        console.warn(`[429] Retrying in ${3 * (i + 1)} seconds...`);
        await delay(3000 * (i + 1)); // ✅ FIXED
        continue;
      }
      throw error;
    }
  }
};

// 1. RUN CODE
const runCode = asyncHandler(async (req, res) => {
  const { language, code, input } = req.body;
  try {
    const sanitizedInput = cleanInput(input);

    const response = await executeCodeWithRetry(language, code, sanitizedInput);

    return res
      .status(200)
      .json(
        new ApiResponse(200, response.data.output, "Executed Successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error.message, "Execution Error"));
  }
});

// 2. RUN EXAMPLE CASES
const run_example_cases = asyncHandler(async (req, res) => {
  const { language, code, example_cases } = req.body;

  try {
    validateCode(language, code);

    if (!example_cases || example_cases.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No example cases provided"));
    }

    const res_output = [];

    for (const testCase of example_cases) {
      try {
        const sanitizedInput = cleanInput(testCase.input);

        const resp = await executeCodeWithRetry(language, code, sanitizedInput);

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

      // ✅ FIXED: increased delay to avoid 429
      await delay(4000);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, res_output, "Example cases executed successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server error"));
  }
});

// 3. RUN TEST CASES
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

        const resp = await executeCodeWithRetry(language, code, sanitizedInput);

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
          break;
        }
      } catch (err) {
        isSuccess = false;
        failedTestCase = {
          input: "Hidden Test Case",
          status: "Runtime Error",
          error: err.response?.data?.error || err.message,
        };
        break;
      }

      // ✅ FIXED: increased delay
      await delay(4000);
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
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to process test cases"));
  }
});

module.exports = { runCode, run_example_cases, runtestcases };
