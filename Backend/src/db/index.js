const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      retryWrites: true,
      w: "majority",
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("MONGODB CONNECTION FAILED", err);
    process.exit(1);
  }
};

module.exports = connectDB;
