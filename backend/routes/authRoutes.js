const express = require("express");
const { signup, login } = require("../controllers/authController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

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

module.exports = router;
