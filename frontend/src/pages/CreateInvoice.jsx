import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft, Gem } from "lucide-react";
import { Link } from "react-router-dom";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer: "",
    paymentStatus: "unpaid",
    paymentMethod: "cash",
    discount: 0,
    items: [],
  });

  // Calculate totals
  const subTotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalTax = formData.items.reduce((sum, item) => sum + (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0), 0);
  const grandTotal = subTotal + totalTax - (formData.discount || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          axios.get("/customers"),
          axios.get("/products"),
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    setFormData({ ...formData, customer: e.target.value });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product: "",
          name: "",
          hsnCode: "",
          weight: 0,
          rate: 0,
          makingCharge: 0,
          amount: 0,
          gstRate: 3,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    const item = { ...newItems[index], [field]: value };

    // Auto-fill from product selection
    if (field === "product" && value) {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        item.name = `${selectedProduct.type} ${selectedProduct.purity} - ${selectedProduct.name}`;
        item.hsnCode = selectedProduct.hsnCode;
        item.weight = selectedProduct.weight;
        item.gstRate = selectedProduct.gstRate;
        item.makingCharge = selectedProduct.makingChargeType === "flat" 
          ? selectedProduct.makingCharge 
          : selectedProduct.makingCharge * selectedProduct.weight;
      }
    }

    // Recalculate amounts
    // Ensuring numbers for calculation
    const weight = parseFloat(item.weight) || 0;
    const rate = parseFloat(item.rate) || 0; // Rate per gram
    const makingCharge = parseFloat(item.makingCharge) || 0;
    
    item.amount = (weight * rate) + makingCharge;
    
    // GST Calculation (Assuming intra-state for now: CGST + SGST)
    const gstRate = parseFloat(item.gstRate) || 3;
    const taxAmount = (item.amount * gstRate) / 100;
    item.cgst = taxAmount / 2;
    item.sgst = taxAmount / 2;
    item.igst = 0;
    
    item.total = item.amount + taxAmount;

    newItems[index] = item;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer) return alert("Please select a customer");
    if (formData.items.length === 0) return alert("Please add at least one item");

    setSaving(true);
    try {
      const payload = {
        ...formData,
        subTotal,
        totalTax,
        grandTotal,
      };
      const res = await axios.post("/invoices", payload);
      alert("Invoice created successfully!");
      navigate(`/invoices`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted">Loading data...</div>;

  return (
    <div style={{ paddingBottom: "3rem" }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/invoices" className="btn btn-secondary" style={{ padding: "0.5rem", width: "auto", border: "none" }}>
            <ArrowLeft size={20} />
          </Link>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
            Create New Invoice
          </h2>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ width: "auto" }}>
          {saving ? "Saving..." : <><Save size={18} /> Save Invoice</>}
        </button>
      </div>

      <div className="glass p-6 mb-6">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--primary)" }}>Bill To</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label className="label">Select Customer *</label>
            <select className="input" value={formData.customer} onChange={handleCustomerChange} required>
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="label">Payment Status</label>
              <select className="input" value={formData.paymentStatus} onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select className="input" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)" }}>Invoice Items</h3>
          <button className="btn btn-secondary" onClick={addItem} style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Product / Item</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>Wt. (g)</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>Rate/g (₹)</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>Making (₹)</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>Amount</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>GST %</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>Total</th>
                <th style={{ padding: "0.5rem", textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "0.5rem" }}>
                    <select 
                      className="input mb-1" 
                      style={{ padding: "0.3rem", fontSize: "0.8rem", height: "auto" }}
                      value={item.product}
                      onChange={(e) => handleItemChange(index, "product", e.target.value)}
                    >
                      <option value="">Custom Item</option>
                      {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.stock} in stock)</option>)}
                    </select>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Item Name"
                      style={{ padding: "0.3rem", fontSize: "0.8rem", height: "auto" }}
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      required
                    />
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="number" step="0.001" className="input text-right" style={{ padding: "0.3rem", fontSize: "0.8rem", height: "auto" }} value={item.weight} onChange={(e) => handleItemChange(index, "weight", e.target.value)} />
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="number" className="input text-right" style={{ padding: "0.3rem", fontSize: "0.8rem", height: "auto" }} value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} />
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="number" className="input text-right" style={{ padding: "0.3rem", fontSize: "0.8rem", height: "auto" }} value={item.makingCharge} onChange={(e) => handleItemChange(index, "makingCharge", e.target.value)} />
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.9rem" }}>
                    ₹{item.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="number" className="input text-right" style={{ padding: "0.3rem", fontSize: "0.8rem", height: "auto" }} value={item.gstRate} onChange={(e) => handleItemChange(index, "gstRate", e.target.value)} />
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontWeight: 600, color: "var(--primary)" }}>
                    ₹{item.total.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    <button onClick={() => removeItem(index)} style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {formData.items.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No items added. Click "Add Item" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="glass p-6" style={{ width: "350px" }}>
          <div className="flex justify-between mb-2">
            <span className="text-muted">Sub Total:</span>
            <span style={{ fontWeight: 500 }}>₹{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted">Total Tax (GST):</span>
            <span style={{ fontWeight: 500 }}>₹{totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 items-center">
            <span className="text-muted">Discount:</span>
            <input 
              type="number" 
              className="input text-right" 
              style={{ width: "100px", padding: "0.3rem" }} 
              value={formData.discount} 
              onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} 
            />
          </div>
          <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>Grand Total:</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
