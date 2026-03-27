const express = require("express");
const app = express();
app.use(express.json());

// ✅ CRITICAL for Render Rate Limiting
app.set("trust proxy", 1);

try {
  const executeRouter = require("./routes/execute.route.js");
  app.use("/", executeRouter);
  console.log("✅ Route loaded successfully");
} catch (err) {
  console.error("❌ Failed to load route:", err.message);
  process.exit(1);
}

const PORT = process.env.PORT || 7001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Judge Server live on port ${PORT}`);
});
