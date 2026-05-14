import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await axios.post("/auth/forgot-password", { email });
      setMessage("Reset link sent! Please check your email inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="auth-card glass"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, #d4a853, #c9a84c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 30px rgba(201, 168, 76, 0.15)",
            }}
          >
            <Mail size={26} color="#0a0a0f" />
          </motion.div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
            Forgot Password?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            We'll send you a reset link to your email.
          </p>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="alert alert-success">
            <CheckCircle size={16} />
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} id="forgot-password-form">
            <div className="form-group">
              <label className="label" htmlFor="forgot-email">Email Address</label>
              <div className="relative">
                <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
                  <Mail size={18} />
                </span>
                <input id="forgot-email" type="email" className="input pl-10" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary mt-2" id="forgot-submit-btn">
              {loading ? (<><span className="spinner" /> Sending...</>) : (<>Send Reset Link <Send size={16} /></>)}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="flex items-center justify-center gap-2" style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
