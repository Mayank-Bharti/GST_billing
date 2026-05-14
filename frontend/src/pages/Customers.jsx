import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { motion } from "framer-motion";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
    pan: "",
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openModal = (customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        address: customer.address || "",
        gstin: customer.gstin || "",
        pan: customer.pan || "",
      });
    } else {
      setCurrentCustomer(null);
      setFormData({ name: "", email: "", phone: "", address: "", gstin: "", pan: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCustomer) {
        await axios.put(`/customers/${currentCustomer._id}`, formData);
      } else {
        await axios.post("/customers", formData);
      }
      fetchCustomers();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        alert("Failed to delete customer");
      }
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={24} style={{ color: "var(--primary)" }} /> Customers
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute" style={{ left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", padding: "0.5rem 1rem 0.5rem 2.5rem" }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => openModal()} style={{ width: "auto", padding: "0.5rem 1rem" }}>
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="p-8 text-center text-muted">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-muted">No customers found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(201, 168, 76, 0.05)" }}>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Name</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>GSTIN / PAN</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} style={{ borderBottom: "1px solid var(--border-subtle)" }} className="hover:bg-white/5 transition-colors">
                    <td style={{ padding: "1rem", fontWeight: 500 }}>
                      {customer.name}
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{customer.email}</div>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{customer.phone}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{customer.gstin || "-"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>{customer.pan || "-"}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div className="flex gap-2">
                        <button onClick={() => openModal(customer)} style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", padding: "0.25rem" }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(customer._id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", padding: "0.25rem" }} title="Delete">
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
            style={{ width: "100%", maxWidth: 500, padding: "1.5rem", borderRadius: "var(--radius-lg)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {currentCustomer ? "Edit Customer" : "Add Customer"}
              </h3>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input type="text" name="phone" className="input" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              
              <div>
                <label className="label">Email Address</label>
                <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} />
              </div>
              
              <div>
                <label className="label">Address</label>
                <input type="text" name="address" className="input" value={formData.address} onChange={handleChange} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">GSTIN</label>
                  <input type="text" name="gstin" className="input" value={formData.gstin} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">PAN Number</label>
                  <input type="text" name="pan" className="input" value={formData.pan} onChange={handleChange} />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{currentCustomer ? "Save Changes" : "Add Customer"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Customers;
