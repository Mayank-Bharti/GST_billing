import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const { name, type, purity, weight, hsnCode, makingCharge, makingChargeType, stock, gstRate } = req.body;

    const product = new Product({
      name,
      type,
      purity,
      weight,
      hsnCode,
      makingCharge,
      makingChargeType,
      stock,
      gstRate,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    const { name, type, purity, weight, hsnCode, makingCharge, makingChargeType, stock, gstRate } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.type = type || product.type;
      product.purity = purity || product.purity;
      product.weight = weight !== undefined ? weight : product.weight;
      product.hsnCode = hsnCode || product.hsnCode;
      product.makingCharge = makingCharge !== undefined ? makingCharge : product.makingCharge;
      product.makingChargeType = makingChargeType || product.makingChargeType;
      product.stock = stock !== undefined ? stock : product.stock;
      product.gstRate = gstRate !== undefined ? gstRate : product.gstRate;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
