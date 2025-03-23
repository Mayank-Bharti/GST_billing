const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes (All API routes will be registered here)
app.use("/api/users", require("../routes/userRoutes"));
app.use("/api/auth", require("../routes/authRoutes"));


module.exports = app;
