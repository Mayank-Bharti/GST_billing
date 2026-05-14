import express from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Admin-Only Routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;