import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authMiddleware, getProducts).post(authMiddleware, createProduct);
router
  .route("/:id")
  .get(authMiddleware, getProductById)
  .put(authMiddleware, updateProduct)
  .delete(authMiddleware, adminMiddleware, deleteProduct);

export default router;
