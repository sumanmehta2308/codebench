const asyncHandler = require("../utils/asyncHandler");
const {
  validateCode,
  validateInput,
} = require("../middlewares/validatecode.middleware");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");

/**
 * HELPER: cleanInput
 * Yeh function "A = 2, B = 3" jaise input se text hata kar use "2 3" bana deta hai.
 * Isse C++ ka 'cin' garbage value nahi dega.
 */
const cleanInput = (str) => {
  if (!str) return "";
  // Sirf numbers, spaces, aur negative signs ko rakha gaya hai
  return str
    .replace(/[a-zA-Z=,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
const runCode = asyncHandler(async (req, res) => {
  const { language, code, input } = req.body;
  const userId = req.user?._id.toString();

  // 🔹 Rate Limiter: 1 Minute Cooldown for 'Run' button
  const rateLimitKey = `rl:${userId}:run`;
  const isLocked = await redisClient.get(rateLimitKey);

  if (isLocked) {
    return res.status(429).json(
      new ApiResponse(429, null, "You can try again after 1 minute.")
    );
  }

  try {
    const sanitizedInput = cleanInput(input);

    // Set 60 seconds lock in Redis
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

module.exports = { runCode };
/**
 * 1. RUN CODE (Custom Input)
 */


/**
 * 2. RUN EXAMPLE CASES (The 'Run' Button)
 * Isme Parallel execution use ki gayi hai speed ke liye.
 */
const run_example_cases = asyncHandler(async (req, res) => {
  const { language, code, example_cases } = req.body;

 // console.log("DEBUG: Received example_cases for processing");

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
          // FIX: Sanitizing input and using correct variable name 'testCase'
          const sanitizedInput = cleanInput(testCase.input);

          //console.log( `DEBUG: Sending sanitized input to Judge: [${sanitizedInput}]`);

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
            input: testCase.input, // Display original input on UI
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
 * Isme sequential execution hai taaki first failure par stop ho sake.
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

        const resp = await axios.post(
          "http://code-judge:7001/execute",
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

    // Save to Database
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
