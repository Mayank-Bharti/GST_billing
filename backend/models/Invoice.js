const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        gstRate: Number,
        total: Number, // price * quantity + GST
      },
    ],
    totalAmount: { type: Number, required: true },
    pdfUrl: { type: String }, // To store invoice PDF URL
    status: { type: String, enum: ["paid", "pending"], default: "pending" },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports =Invoice;
