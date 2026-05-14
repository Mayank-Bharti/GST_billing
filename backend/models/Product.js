import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["gold", "silver", "diamond", "other"], required: true },
    purity: { type: String, default: "22K" }, // e.g., 18K, 22K, 24K, 92.5
    weight: { type: Number, required: true }, // in grams
    hsnCode: { type: String, required: true },
    makingCharge: { type: Number, default: 0 }, // per gram or flat based on setting
    makingChargeType: { type: String, enum: ["per_gram", "flat"], default: "per_gram" },
    stock: { type: Number, required: true, default: 1 },
    gstRate: { type: Number, required: true, default: 3 }, // standard GST for jewellery is 3%
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;