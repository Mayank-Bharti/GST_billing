import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        hsnCode: { type: String },
        weight: { type: Number, required: true }, // grams
        rate: { type: Number, required: true }, // Gold/Silver rate per gram on that day
        makingCharge: { type: Number, default: 0 },
        amount: { type: Number, required: true }, // (weight * rate) + makingCharge
        gstRate: { type: Number, required: true }, // typically 3%
        cgst: { type: Number, required: true },
        sgst: { type: Number, required: true },
        igst: { type: Number, default: 0 },
        total: { type: Number, required: true }, // amount + cgst + sgst + igst
      },
    ],
    subTotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }, // subTotal + totalTax - discount
    paymentStatus: { type: String, enum: ["paid", "unpaid", "partial"], default: "unpaid" },
    paymentMethod: { type: String, enum: ["cash", "card", "upi", "bank_transfer"] },
    pdfUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
