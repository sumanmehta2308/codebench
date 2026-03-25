const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runJava = (code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const containerTempDir = path.join(__dirname, "temp", jobId);

    try {
      if (!fs.existsSync(containerTempDir)) {
        fs.mkdirSync(containerTempDir, { recursive: true, mode: 0o777 });
      }

      const cleanInput = String(input).replace(/\r\n/g, "\n").trim() + "\n";
      // Java requires the filename to be Main.java if the class is Main
      fs.writeFileSync(path.join(containerTempDir, "Main.java"), code, "utf8");
      fs.writeFileSync(
        path.join(containerTempDir, "input.txt"),
        cleanInput,
        "utf8"
      );
    } catch (err) {
      return reject(`FileSystem Error: ${err.message}`);
    }

    // ✅ Native command (Uses javac and java installed in Dockerfile)
    // We use -cp (classpath) to point to the temp directory
    const nativeCmd = `javac ${path.join(
      containerTempDir,
      "Main.java"
    )} && java -cp ${containerTempDir} Main < ${path.join(
      containerTempDir,
      "input.txt"
    )}`;

    exec(nativeCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      if (fs.existsSync(containerTempDir)) {
        fs.rmSync(containerTempDir, { recursive: true, force: true });
      }

      if (error) return resolve(stderr || error.message);
      resolve(stdout);
    });
  });
};
module.exports = { runJava };
