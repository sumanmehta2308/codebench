const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runC = (code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();

    // ✅ CHANGE: Use /app/temp (internal to Judge) instead of /shared (Docker volume)
    const containerTempDir = path.join(__dirname, "temp", jobId);

    try {
      if (!fs.existsSync(containerTempDir)) {
        fs.mkdirSync(containerTempDir, { recursive: true, mode: 0o777 });
      }

      const cleanInput = String(input).replace(/\r\n/g, "\n").trim() + "\n";

      fs.writeFileSync(path.join(containerTempDir, "main.c"), code, "utf8");
      fs.writeFileSync(
        path.join(containerTempDir, "input.txt"),
        cleanInput,
        "utf8"
      );
    } catch (err) {
      return reject(`Judge File System Error: ${err.message}`);
    }

    // ❌ REMOVE: The old Docker command that caused the "unix:///var/run/docker.sock" error
    /*
    const dockerCmd = `docker run --rm \
      -v codebench_temp:/shared \
      -w /shared/${jobId} \
      gcc:latest \
      bash -c "gcc main.c -o out && ./out < input.txt"`; 
    */

    // ✅ ADD: This "Native" command. It uses the 'gcc' installed inside your Dockerfile.
    // It works on your laptop AND on Render.
    const nativeCmd = `gcc ${path.join(
      containerTempDir,
      "main.c"
    )} -o ${path.join(containerTempDir, "out")} && ${path.join(
      containerTempDir,
      "out"
    )} < ${path.join(containerTempDir, "input.txt")}`;

    // ✅ CHANGE: Use nativeCmd here instead of dockerCmd
    exec(nativeCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      // Cleanup files after execution
      if (fs.existsSync(containerTempDir)) {
        fs.rmSync(containerTempDir, { recursive: true, force: true });
      }

      if (error) {
        // Resolve stderr (compile errors) so the user sees what they did wrong
        return resolve(stderr || error.message);
      }
      resolve(stdout);
    });
  });
};
module.exports = { runC };
