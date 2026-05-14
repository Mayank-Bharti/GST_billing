import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authMiddleware, getCustomers).post(authMiddleware, createCustomer);
router
  .route("/:id")
  .get(authMiddleware, getCustomerById)
  .put(authMiddleware, updateCustomer)
  .delete(authMiddleware, adminMiddleware, deleteCustomer);

export default router;
