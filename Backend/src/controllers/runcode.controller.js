const asyncHandler = require("../utils/asyncHandler");
const { validateCode } = require("../middlewares/validatecode.middleware");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");
const http = require("http");
const https = require("https");

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

require("http").globalAgent.maxSockets = 50;
require("https").globalAgent.maxSockets = 50;

const cleanInput = (str) => {
  if (!str) return "";
  const numbers = str.match(/-?\d+/g);
  return numbers ? numbers.join(" ") : "";
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const executeCodeWithRetry = async (language, code, input, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        `${process.env.JUDGE0_URL}/execute`,
        { language, code, input },
        {
          timeout: 30000,
          httpAgent,
          httpsAgent,
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        console.warn(
          `[429] Cloud Firewall Block. Retry ${i + 1}... waiting 2s`
        );
        await delay(2000);
        continue;
      }
      throw error;
    }
  }
};

// 1. RUN CODE (Instant)
const runCode = asyncHandler(async (req, res) => {
  const { language, code, input } = req.body;
  try {
    const response = await executeCodeWithRetry(
      language,
      code,
      cleanInput(input)
    );
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

// 2. RUN EXAMPLE CASES (Paced Loop)
const run_example_cases = asyncHandler(async (req, res) => {
  const { language, code, example_cases } = req.body;
  try {
    validateCode(language, code);
    const res_output = [];

    for (const testCase of example_cases) {
      try {
        const resp = await executeCodeWithRetry(
          language,
          code,
          cleanInput(testCase.input)
        );
        const actual = (resp.data.output || "").toString().trim();
        const expected = (testCase.output || "").toString().trim();

        res_output.push({
          input: testCase.input,
          expectedOutput: expected,
          actualOutput: actual,
          isMatch: actual === expected,
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
      // 🛡️ FIX: Increased delay to 350ms to bypass global cloud rate limits
      await delay(350);
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

// 3. RUN TEST CASES (Paced Loop)
const runtestcases = asyncHandler(async (req, res) => {
  const { language, problem_id, code } = req.body;
  try {
    validateCode(language, code);
    const problem = await Problem.findById(problem_id).select("test_cases");
    let failedTestCase = null;
    let isSuccess = true;

    for (const testCase of problem.test_cases) {
      try {
        const resp = await executeCodeWithRetry(
          language,
          code,
          cleanInput(testCase.input)
        );
        const actual = (resp.data.output || "").toString().trim();
        const expected = testCase.output.toString().trim();

        if (actual !== expected) {
          isSuccess = false;
          failedTestCase = {
            input: testCase.input,
            actualOutput: actual,
            expectedOutput: expected,
            status: "Wrong Answer",
          };
          break;
        }
      } catch (err) {
        isSuccess = false;
        failedTestCase = {
          input: "Hidden Case",
          status: "Runtime Error",
          error: err.message,
        };
        break;
      }
      // 🛡️ FIX: Increased delay to 350ms to bypass global cloud rate limits
      await delay(350);
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
