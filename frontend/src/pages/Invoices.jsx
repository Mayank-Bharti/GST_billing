import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FileText, Plus, Eye, Download, Search, AlertTriangle, Trash2 } from "lucide-react";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`/invoices/${id}`);
        fetchInvoices();
      } catch (err) {
        alert("Failed to delete invoice");
      }
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={24} style={{ color: "var(--primary)" }} /> Invoices
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute" style={{ left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search invoice or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", padding: "0.5rem 1rem 0.5rem 2.5rem" }}
            />
          </div>
          <Link to="/invoices/create" className="btn btn-primary" style={{ width: "auto", padding: "0.5rem 1rem" }}>
            <Plus size={18} /> New Invoice
          </Link>
        </div>
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="p-8 text-center text-muted">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-8 text-center text-muted">No invoices found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(201, 168, 76, 0.05)" }}>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Invoice #</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Date</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} style={{ borderBottom: "1px solid var(--border-subtle)" }} className="hover:bg-white/5 transition-colors">
                    <td style={{ padding: "1rem", fontWeight: 500, fontFamily: "monospace" }}>
                      {invoice.invoiceNumber}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 500 }}>{invoice.customer?.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{invoice.customer?.phone}</div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "var(--text-main)" }}>
                      ₹{invoice.grandTotal?.toLocaleString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        textTransform: "uppercase", 
                        background: invoice.paymentStatus === 'paid' ? "rgba(74, 158, 126, 0.15)" : invoice.paymentStatus === 'unpaid' ? "rgba(224, 82, 82, 0.15)" : "rgba(212, 168, 83, 0.15)",
                        color: invoice.paymentStatus === 'paid' ? "#4a9e7e" : invoice.paymentStatus === 'unpaid' ? "#e05252" : "#d4a853",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.7rem",
                        fontWeight: 700
                      }}>
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div className="flex gap-2">
                        <button style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", padding: "0.25rem" }} title="View">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => window.open(`http://localhost:5000/api/invoices/${invoice._id}/pdf`, '_blank')}
                          style={{ background: "transparent", border: "none", color: "var(--accent-sapphire)", cursor: "pointer", padding: "0.25rem" }} 
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <button onClick={() => handleDelete(invoice._id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", padding: "0.25rem" }} title="Delete">
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
    </div>
  );
};

export default Invoices;
