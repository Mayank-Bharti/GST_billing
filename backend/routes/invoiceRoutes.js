import express from "express";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  generatePDF
} from "../controllers/invoiceController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authMiddleware, getInvoices).post(authMiddleware, createInvoice);
router
  .route("/:id")
  .get(authMiddleware, getInvoiceById)
  .delete(authMiddleware, adminMiddleware, deleteInvoice);

router.route("/:id/status").put(authMiddleware, updateInvoiceStatus);
router.route("/:id/pdf").get(authMiddleware, generatePDF);

export default router;
