const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
// FIX 429 BUG: Must be at the top to let middlewares see the real User IP
app.set("trust proxy", 1);
const allowedOrigins = [
  "https://codebench-olive.vercel.app",
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

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
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
const userRouter = require("./routes/user.routes");
const tweetRouter = require("./routes/tweet.routes");
const problemRouter = require("./routes/problem.routes");
const runcodeRouter = require("./routes/runcode.route");
const submissionRouter = require("./routes/submission.routes");
const aiRouter = require("./routes/ai.routes");
const contestRouter = require("./routes/contest.routes");

app.use("/users", userRouter);
app.use("/tweet", tweetRouter);
app.use("/problem", problemRouter);
app.use("/runcode", runcodeRouter);
app.use("/submissions", submissionRouter);
app.use("/ai", aiRouter);
app.use("/contests", contestRouter);

module.exports = app;
