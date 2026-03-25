const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// ✅ FIXED: Allowing multiple origins (Local and Production)
const allowedOrigins = [
  process.env.CORS_ORIGIN,           // Takes the URL from Render Dashboard
  "https://codebench-olive.vercel.app", // Hardcoded backup for safety
  "http://localhost:5173",          // Local Vite
  "http://localhost:3000",          // Local React
].filter(Boolean);                  // Removes any empty/null values

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200, // ✅ ADD THIS LINE
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
const userRouter = require("./routes/user.routes");
const tweetRouter = require("./routes/tweet.routes");
const problemRouter = require("./routes/problem.routes");
const runcodeRouter = require("./routes/runcode.route");
const submissionRouter = require("./routes/submission.routes");
const aiRouter = require("./routes/ai.routes");
const contestRouter = require("./routes/contest.routes");

// Routes Declaration
app.use("/users", userRouter);
app.use("/tweet", tweetRouter);
app.use("/problem", problemRouter);
app.use("/runcode", runcodeRouter);
app.use("/submissions", submissionRouter);
app.use("/ai", aiRouter);
app.use("/contests", contestRouter);

// Export app
module.exports = app;
