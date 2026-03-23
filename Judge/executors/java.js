const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runJava = (code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();

    // 1. THIS PATH MUST MATCH YOUR VOLUME MOUNT
    // If your backend container has -v codebench_temp:/shared,
    // then you MUST write to /shared
    const containerTempDir = path.join("/", "shared", jobId);

    try {
      if (!fs.existsSync(containerTempDir)) {
        fs.mkdirSync(containerTempDir, { recursive: true, mode: 0o777 });
      }

      const cleanInput = String(input).replace(/\r\n/g, "\n").trim() + "\n";

      // Write files
      fs.writeFileSync(path.join(containerTempDir, "Main.java"), code, "utf8");
      fs.writeFileSync(
        path.join(containerTempDir, "input.txt"),
        cleanInput,
        "utf8"
      );

      // Set permissions so the other container can read them
      fs.chmodSync(path.join(containerTempDir, "Main.java"), 0o644);
      fs.chmodSync(path.join(containerTempDir, "input.txt"), 0o644);
    } catch (err) {
      return reject(`FileSystem Error: ${err.message}`);
    }

    // 2. THE DOCKER COMMAND
    // Use the NAMED VOLUME 'codebench_temp'
    const dockerCmd = `docker run --rm \
      -v codebench_temp:/shared \
      -w /shared/${jobId} \
      eclipse-temurin:17-jdk \
      bash -c "javac Main.java && java Main < input.txt"`;

    exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      // Cleanup
      if (fs.existsSync(containerTempDir)) {
        fs.rmSync(containerTempDir, { recursive: true, force: true });
      }

      if (error) return resolve(stderr || error.message);
      resolve(stdout);
    });
  });
};
module.exports = { runJava };
