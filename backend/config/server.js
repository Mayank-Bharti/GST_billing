const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser"); 
require("../config/passport");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

app.use(session({
  secret: "session-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes (All API routes will be registered here)
app.use("/api/users", require("../routes/userRoutes"));
app.use("/api/auth", require("../routes/authRoutes"));


module.exports = app;
