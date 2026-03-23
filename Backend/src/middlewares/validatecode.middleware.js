const { ApiError } = require("../utils/ApiError.js");

const forbiddenWords = {
  c: [
    "system",
    "exec",
    "pipe",
    "malloc",
    "free",
    "realloc",
    "delete",
    "fork",
    "system(",
  ],
  cpp: [
    "system",
    "exec",
    "pipe",
    "malloc",
    "free",
    "realloc",
    "delete",
    "popen",
    "fork",
    "unistd.h",
  ],
  java: [
    "Runtime.exec",
    "ProcessBuilder",
    "Process",
    "getRuntime()",
    "exec(",
    "start()",
  ],
  python: [
    "subprocess.run",
    "os.system",
    "os.spawn",
    "open",
    "read",
    "write",
    "import os",
    "import subprocess",
    "from os import",
    "from subprocess import",
  ],
};

const validateCode = (language, code) => {
  if (!code || code.trim() === "") {
    throw new ApiError(400, "Code is required");
  }
  const forbiddenWords = ["system", "fork", "exec", "spawn", "kill"];
  const cleanCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

  for (const word of forbiddenWords) {
    if (cleanCode.includes(word)) {
      throw new ApiError(
        400,
        `${language.toUpperCase()} code contains forbidden word: ${word}`
      );
    }
  }
};
const validateInput = (language, userInput) => {
  const wordsToCheck = forbiddenWords[language];
  if (!wordsToCheck) {
    throw new ApiError(400, "Unsupported Language");
  }

  for (const word of wordsToCheck) {
    if (userInput && userInput.includes(word)) {
      throw new ApiError(
        400,
        `${language.toUpperCase()} user input contains forbidden word: ${word}`
      );
    }
  }
};

module.exports = { validateCode, validateInput };