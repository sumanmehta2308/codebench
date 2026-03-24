const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// ✅ FIXED: Allowing multiple origins (Local and Production)
const allowedOrigins = [
  process.env.CORS_ORIGIN, // https://codebench-olive.vercel.app
  "http://localhost:5173", // Vite Local
  "http://localhost:3000", // General Local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
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
