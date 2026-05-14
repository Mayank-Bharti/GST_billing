import express from "express";
import csrf from "csurf";
import passport from "passport";
import { body, validationResult } from "express-validator";
import {
  signup,
  login,
  setPassword,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import "../config/passport.js";

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// CSRF token route
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.cookie("csrf_token", req.csrfToken(), {
    httpOnly: false,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ csrfToken: req.csrfToken() });
});

// Public Routes
router.post("/signup", csrfProtection, signupValidation, validate, signup);
router.post("/login", csrfProtection, loginValidation, validate, login);
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars")],
  validate,
  resetPassword
);

// Authenticated user info
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User authenticated",
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Protected Routes
router.put(
  "/update-profile",
  authMiddleware,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email required"),
  ],
  validate,
  updateProfile
);
router.post("/set-password", authMiddleware, setPassword);
router.post("/logout", authMiddleware, logout);

// Admin-Only Routes
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin access granted" });
});

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
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback — redirect to frontend with token
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const token = req.user.token;
    // Redirect to frontend with token in query string
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

export default router;
