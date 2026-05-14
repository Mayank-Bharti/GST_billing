import React, { useState, useEffect } from "react";
import axios from "axios";
import { Package, Plus, Edit2, Trash2, Search, X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "gold",
    purity: "22K",
    weight: "",
    hsnCode: "",
    makingCharge: "",
    makingChargeType: "per_gram",
    stock: 1,
    gstRate: 3,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        type: product.type,
        purity: product.purity,
        weight: product.weight,
        hsnCode: product.hsnCode,
        makingCharge: product.makingCharge,
        makingChargeType: product.makingChargeType,
        stock: product.stock,
        gstRate: product.gstRate,
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: "",
        type: "gold",
        purity: "22K",
        weight: "",
        hsnCode: "",
        makingCharge: "",
        makingChargeType: "per_gram",
        stock: 1,
        gstRate: 3,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await axios.put(`/products/${currentProduct._id}`, formData);
      } else {
        await axios.post("/products", formData);
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.hsnCode.includes(search)
  );

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Package size={24} style={{ color: "var(--primary)" }} /> Inventory
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute" style={{ left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by name or HSN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", padding: "0.5rem 1rem 0.5rem 2.5rem" }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => openModal()} style={{ width: "auto", padding: "0.5rem 1rem" }}>
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="p-8 text-center text-muted">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-muted">No products found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(201, 168, 76, 0.05)" }}>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Item Details</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Category</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Weight / Making</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Stock / GST</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} style={{ borderBottom: "1px solid var(--border-subtle)" }} className="hover:bg-white/5 transition-colors">
                    <td style={{ padding: "1rem", fontWeight: 500 }}>
                      {product.name}
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>HSN: {product.hsnCode}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        textTransform: "capitalize", 
                        background: product.type === 'gold' ? "rgba(201, 168, 76, 0.15)" : product.type === 'silver' ? "rgba(156, 163, 175, 0.15)" : "rgba(167, 139, 250, 0.15)",
                        color: product.type === 'gold' ? "#c9a84c" : product.type === 'silver' ? "#d1d5db" : "#a78bfa",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.75rem"
                      }}>
                        {product.type} {product.purity}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.875rem" }}>{product.weight} g</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                        MC: ₹{product.makingCharge} ({product.makingChargeType === 'per_gram' ? '/g' : 'flat'})
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div className="flex items-center gap-1" style={{ fontSize: "0.875rem", color: product.stock <= 5 ? "var(--warning)" : "inherit" }}>
                        {product.stock <= 5 && <AlertTriangle size={14} />} {product.stock} pcs
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>GST: {product.gstRate}%</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div className="flex gap-2">
                        <button onClick={() => openModal(product)} style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", padding: "0.25rem" }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", padding: "0.25rem" }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ width: "100%", maxWidth: 600, padding: "1.5rem", borderRadius: "var(--radius-lg)", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {currentProduct ? "Edit Item" : "Add New Item"}
              </h3>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Item Name *</label>
                  <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label">HSN Code *</label>
                  <input type="text" name="hsnCode" className="input" value={formData.hsnCode} onChange={handleChange} required />
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Metal Type *</label>
                  <select name="type" className="input" value={formData.type} onChange={handleChange}>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="diamond">Diamond</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Purity (e.g. 22K) *</label>
                  <input type="text" name="purity" className="input" value={formData.purity} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Weight (grams) *</label>
                  <input type="number" step="0.001" name="weight" className="input" value={formData.weight} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label">Stock Qty *</label>
                  <input type="number" name="stock" className="input" value={formData.stock} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label">GST Rate (%) *</label>
                  <input type="number" name="gstRate" className="input" value={formData.gstRate} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Making Charge (₹)</label>
                  <input type="number" name="makingCharge" className="input" value={formData.makingCharge} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Making Charge Type</label>
                  <select name="makingChargeType" className="input" value={formData.makingChargeType} onChange={handleChange}>
                    <option value="per_gram">Per Gram</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{currentProduct ? "Save Changes" : "Add Item"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
