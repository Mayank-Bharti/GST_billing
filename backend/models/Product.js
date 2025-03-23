const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    gstRate: { type: Number, required: true },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);
module.exports =Product;

// module.exports = mongoose.model("Product", ProductSchema);   ///aise bhi likh sakte h