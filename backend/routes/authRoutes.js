const express = require("express");
const csrf = require("csurf");
const { signup, login, setPassword, logout } = require("../controllers/authController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const passport=require("passport");
const router = express.Router();
const csrfProtection = csrf({ cookie: true });
require("../config/passport");

// CSRF token route
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.cookie("csrf_token", req.csrfToken(), {
    httpOnly: false,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 
  });
  res.json({ csrfToken: req.csrfToken() });
});
// Public Routes
router.post("/signup", csrfProtection,signup);
router.post("/login",csrfProtection, login);

// Authenticated user info
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "User authenticated", user: req.user });
});

// Protected Route (User Info)
router.post("/set-password", authMiddleware, setPassword);
router.post("/logout", authMiddleware, csrfProtection, logout);

// Admin-Only Route
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin access granted" });
});

//Admin dashboard
router.get("/dashboard/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

// Staff Dashboard
router.get("/dashboard/staff", authMiddleware, (req, res) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ message: "Access denied. Staff only." });
  }

  res.json({
    message: "Welcome to Staff Dashboard",
    user: req.user,
  });
});

// Initiate login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json({
      message: req.user.message || "Google OAuth successful",
      token: req.user.token,
      user: req.user.user,
    });
  }
);


module.exports = router;
