import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import app from "./config/server.js"; // Import Express App
import connectDB from "./config/db.js"; // Import MongoDB Connection

// Connect to Database
connectDB();

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
