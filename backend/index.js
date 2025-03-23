require("dotenv").config();
const app = require("./config/server"); // Import Express App
const connectDB = require("./config/db"); // Import MongoDB Connection

// Connect to Database
connectDB();

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
