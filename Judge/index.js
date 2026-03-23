const express = require("express");
const app = express();
app.use(express.json());

// 💡 Simple relative path: Docker environment mein ye hamesha sahi resolve hota hai
try {
  const executeRouter = require("./routes/execute.route.js");
  app.use("/", executeRouter);
  console.log("✅ Route loaded successfully");
} catch (err) {
  console.error("❌ Failed to load route. Error:", err.message);
  process.exit(1);
}

const PORT = 7001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Judge Server live on port ${PORT}`);
});
