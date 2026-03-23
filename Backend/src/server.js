require("dotenv").config();
const connectDB = require("./db/index");
const redisClient = require("./db/redis");
const createSocketServer = require("./SocketIo/SocketIo");
const app = require("./app"); // Import the CONFIGURED app from app.js

// Remove the app.use(cors(...)) and app.use(express.json()) from here
// because they are already defined in app.js!

const server = createSocketServer(app);

const startServer = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected");
    }
    await connectDB();
    const port = process.env.PORT || 8000;

    // Use 'server.listen' NOT 'app.listen' to ensure Socket.io works
    server.listen(port, "0.0.0.0", () => {
      console.log(`⚙️ CodeBench Server running at: ${port}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
