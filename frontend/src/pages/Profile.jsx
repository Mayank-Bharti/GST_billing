import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { User, Mail, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.put("/auth/update-profile", formData);
      setMessage(res.data.message || "Profile updated successfully!");
      // Optionally reload or update context user
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{ maxWidth: 640, padding: "2rem", borderRadius: "var(--radius-xl)" }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}>
        Profile Settings
      </h2>

      {message && (
        <div className="alert alert-success">
          <CheckCircle size={18} /> {message}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Full Name</label>
          <div className="relative">
            <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
              <User size={18} />
            </span>
            <input
              type="text"
              name="name"
              className="input pl-10"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Email Address</label>
          <div className="relative">
            <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              className="input pl-10"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ opacity: 0.7 }}>
          <label className="label">Account Role</label>
          <div className="relative">
            <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
              <Shield size={18} />
            </span>
            <input
              type="text"
              className="input pl-10"
              value={user?.role === "admin" ? "Administrator" : "Staff Member"}
              disabled
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Roles can only be changed by an Administrator from User Management.
          </p>
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

export default Profile;
