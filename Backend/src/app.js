const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
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
app.use("/users", userRouter); // Added standard prefix common in these setups
app.use("/tweet", tweetRouter);
app.use("/problem", problemRouter);
app.use("/runcode", runcodeRouter);
app.use("/submissions", submissionRouter);
app.use("/ai", aiRouter);
app.use("/contests", contestRouter);
// Export app
module.exports = app;
