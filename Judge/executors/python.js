const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runPython = (code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const containerTempDir = path.join("/", "shared", jobId);

    try {
      if (!fs.existsSync(containerTempDir)) {
        fs.mkdirSync(containerTempDir, { recursive: true, mode: 0o777 });
      }

      // FIX: Ensure multi-line strings are preserved and encoded correctly
      const cleanInput = String(input).replace(/\r\n/g, "\n").trim() + "\n";

      fs.writeFileSync(path.join(containerTempDir, "main.py"), code, "utf8");
      // FIX: Explicitly write as utf8 to avoid string corruption in Docker
      fs.writeFileSync(
        path.join(containerTempDir, "input.txt"),
        cleanInput,
        "utf8"
      );
    } catch (err) {
      return reject(`Judge File System Error: ${err.message}`);
    }

    // FIX: Using bash -c ensures the redirection < works consistently
    const dockerCmd = `docker run --rm \
      -v codebench_temp:/shared \
      -w /shared/${jobId} \
      python:3-slim \
      bash -c "python3 main.py < input.txt"`;

    exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      if (fs.existsSync(containerTempDir))
        fs.rmSync(containerTempDir, { recursive: true, force: true });

      if (error) {
        return resolve(stderr || error.message);
      }
      resolve(stdout);
    });
  });
};

module.exports = { runPython };
