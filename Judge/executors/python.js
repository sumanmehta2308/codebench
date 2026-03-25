const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runPython = (code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const containerTempDir = path.join(__dirname, "temp", jobId);

    try {
      if (!fs.existsSync(containerTempDir)) {
        fs.mkdirSync(containerTempDir, { recursive: true, mode: 0o777 });
      }

      const cleanInput = String(input).replace(/\r\n/g, "\n").trim() + "\n";
      fs.writeFileSync(path.join(containerTempDir, "main.py"), code, "utf8");
      fs.writeFileSync(
        path.join(containerTempDir, "input.txt"),
        cleanInput,
        "utf8"
      );
    } catch (err) {
      return reject(`Judge File System Error: ${err.message}`);
    }

    // ✅ Native command (Uses python3 installed in Dockerfile)
    const nativeCmd = `python3 ${path.join(
      containerTempDir,
      "main.py"
    )} < ${path.join(containerTempDir, "input.txt")}`;

    exec(nativeCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      if (fs.existsSync(containerTempDir))
        fs.rmSync(containerTempDir, { recursive: true, force: true });

      if (error) return resolve(stderr || error.message);
      resolve(stdout);
    });
  });
};

module.exports = { runPython };
