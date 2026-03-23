const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runC = (code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const containerTempDir = path.join("/", "shared", jobId);

    try {
      if (!fs.existsSync(containerTempDir)) {
        fs.mkdirSync(containerTempDir, { recursive: true, mode: 0o777 });
      }

      // --- FIX START ---
      // Force input to string, fix line breaks, and trim extra trailing whitespace
      const cleanInput = String(input).replace(/\r\n/g, "\n").trim() + "\n";

      fs.writeFileSync(path.join(containerTempDir, "main.c"), code, "utf8");
      // Explicitly write input.txt as utf8
      fs.writeFileSync(
        path.join(containerTempDir, "input.txt"),
        cleanInput,
        "utf8"
      );
      // --- FIX END ---
    } catch (err) {
      return reject(`Judge File System Error: ${err.message}`);
    }

    const dockerCmd = `docker run --rm \
  -v codebench_temp:/shared \
  -w /shared/${jobId} \
  gcc:latest \
  bash -c "gcc main.c -o out && ./out < input.txt"`; // Use bash -c

    exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      // Cleanup
      if (fs.existsSync(containerTempDir))
        fs.rmSync(containerTempDir, { recursive: true, force: true });

      if (error) {
        // Resolve stderr so users see their code errors instead of backend crashes
        return resolve(stderr || error.message);
      }
      resolve(stdout);
    });
  });
};

module.exports = { runC };