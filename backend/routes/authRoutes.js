const express = require("express");
const { signup, login } = require("../controllers/authController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const passport=require("passport");
const router = express.Router();
require("../config/passport");
// Public Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Route (User Info)
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "User authenticated", user: req.user });
});
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
      message: "Google OAuth successful",
      token: req.user.token,
      user: req.user.user,
    });
  }
);

module.exports = router;
