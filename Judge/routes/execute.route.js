const express = require("express");
const router = express.Router();
const { runC } = require("../executors/c.js");
const { runPython } = require("../executors/python.js");
const { runCpp } = require("../executors/cpp.js");
const { runJava } = require("../executors/java.js");

router.post("/execute", async (req, res) => {
  const { language, code, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  try {
    const lang = language.toLowerCase();
    let result;

    switch (lang) {
      case "c":
        result = await runC(code, input || "");
        break;
      case "python":
      case "py":
        result = await runPython(code, input || "");
        break;
      case "cpp":
      case "c++":
        result = await runCpp(code, input || "");
        break;
      case "java":
        result = await runJava(code, input || "");
        break;
      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    res.json({ status: "Accepted", output: result });
  } catch (e) {
    res.status(500).json({
      status: "Runtime Error From Judge",
      error: e.message || e.toString(),
    });
  }
});

module.exports =router; // Changed to match common export style
