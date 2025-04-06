const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
require("../config/passport");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(session({ secret: "session-secret", resave: false, saveUninitialized: true }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes (All API routes will be registered here)
app.use("/api/users", require("../routes/userRoutes"));
app.use("/api/auth", require("../routes/authRoutes"));


module.exports = app;
