const asyncHandler = require("../utils/asyncHandler");
const { validateCode } = require("../middlewares/validatecode.middleware");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");

// Cleans up the input string to match what the compiler expects
const cleanInput = (str) => {
  if (!str) return "";
  const numbers = str.match(/-?\d+/g);
  return numbers ? numbers.join(" ") : "";
};

// 💡 THE FIX: A delay function to force the loop to pause and bypass the 429 Rate Limit
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 💡 THE SHIELD: This function intercepts 429 errors from Render's Proxy and automatically retries.
// It waits 2 seconds, then 4 seconds, etc., so the frontend never sees a crash.
const executeCodeWithRetry = async (language, code, input, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        `${process.env.JUDGE0_URL}/execute`,
        { language, code, input },
        {
          timeout: 60000, // Keep at 60s for cloud cold starts
          // 🚀 THE MAGIC FIX: Ye headers Cloudflare ko bewakoof banayenge ki hum asli PC hain
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response; // Success! Return immediately.
    } catch (error) {
      // If it's a 429 Rate Limit AND we haven't run out of retries...
      if (error.response && error.response.status === 429 && i < retries - 1) {
        console.warn(
          `[429 Caught] Judge is busy. Retrying in ${2 * (i + 1)} seconds...`
        );
        await delay(2000 * (i + 1)); // Wait 2s, then 4s, then try again
        continue;
      }
      // If it's a different error (like a syntax error) or we are out of retries, throw it.
      throw error;
    }
  }
};

// 1. RUN CODE (Custom Input)
const runCode = asyncHandler(async (req, res) => {
  const { language, code, input } = req.body;
  try {
    const sanitizedInput = cleanInput(input);

    // Using the shield function for a single run
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

// 2. RUN EXAMPLE CASES (The 'Run' Button)
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

    // Sequential Execution
    for (const testCase of example_cases) {
      try {
        const sanitizedInput = cleanInput(testCase.input);

        // Using the shield function
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

      // 💡 THROTTLE: Wait 1.5 seconds before firing the next test case to prevent proxy blocks
      await delay(1500);
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

// 3. RUN TEST CASES (The 'Submit' Button)
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

    // Sequential Execution for Hidden Tests
    for (const testCase of problem.test_cases) {
      try {
        const sanitizedInput = cleanInput(testCase.input);

        // Using the shield function
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
          break; // Stop checking after first failure
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

      // 💡 THROTTLE: Wait 1.5 seconds before firing the next test case
      await delay(1500);
    }

    // Save to database
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
