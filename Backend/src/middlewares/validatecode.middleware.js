const { ApiError } = require("../utils/ApiError.js");

const languageSpecificForbiddenWords = {
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

// Generic list applied to ALL languages
const genericForbiddenWords = ["system", "fork", "exec", "spawn", "kill"];

const validateCode = (language, code) => {
  if (!code || code.trim() === "") {
    throw new ApiError(400, "Code is required");
  }

  const cleanCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

  // 1. Check generic forbidden words first
  for (const word of genericForbiddenWords) {
    if (cleanCode.includes(word)) {
      throw new ApiError(
        400,
        `${language.toUpperCase()} code contains forbidden word: ${word}`
      );
    }
  }

  // 2. Check language-specific forbidden words
  const specificWords = languageSpecificForbiddenWords[language.toLowerCase()];
  if (specificWords) {
    for (const word of specificWords) {
      if (cleanCode.includes(word)) {
        throw new ApiError(
          400,
          `${language.toUpperCase()} code contains forbidden word: ${word}`
        );
      }
    }
  }
};

const validateInput = (language, userInput) => {
  const wordsToCheck = languageSpecificForbiddenWords[language.toLowerCase()];
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
