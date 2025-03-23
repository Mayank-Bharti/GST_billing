const mongoose = require("mongoose");

// MongoDB Connection

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
