import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, User, Mail, Lock, Shield, AlertCircle, Eye, EyeOff, CheckCircle2, Gem } from "lucide-react";
import { motion } from "framer-motion";

const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const passwordRequirements = [
  { test: (p) => p.length >= 6, label: "At least 6 characters" },
  { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p) => /[0-9]/.test(p), label: "One number" },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(formData);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
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
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, #4a9e7e, #5b7fb5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 30px rgba(74, 158, 126, 0.15)",
            }}
          >
            <UserPlus size={26} color="white" />
          </motion.div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Join Mayank Madhuri Jewellers
          </p>
        </div>

        {/* Google Button */}
        <button type="button" onClick={handleGoogleSignup} className="btn btn-google" id="google-signup-btn">
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="divider">or sign up with email</div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} id="signup-form">
          <div className="form-group">
            <label className="label" htmlFor="signup-name">Full Name</label>
            <div className="relative">
              <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
                <User size={18} />
              </span>
              <input id="signup-name" name="name" type="text" className="input pl-10" placeholder="John Doe" value={formData.name} onChange={handleChange} required autoComplete="name" />
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-email">Email Address</label>
            <div className="relative">
              <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
                <Mail size={18} />
              </span>
              <input id="signup-email" name="email" type="email" className="input pl-10" placeholder="you@example.com" value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-password">Password</label>
            <div className="relative">
              <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
                <Lock size={18} />
              </span>
              <input id="signup-password" name="password" type={showPassword ? "text" : "password"} className="input pl-10" placeholder="••••••••" value={formData.password} onChange={handleChange} required autoComplete="new-password" style={{ paddingRight: "2.75rem" }} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength */}
            {formData.password && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: "0.5rem" }}>
                {passwordRequirements.map((req, i) => {
                  const met = req.test(formData.password);
                  return (
                    <div key={i} className="flex items-center gap-2" style={{ fontSize: "0.75rem", color: met ? "var(--success)" : "var(--text-faint)", marginBottom: "0.2rem", transition: "color var(--transition-fast)" }}>
                      <CheckCircle2 size={13} />
                      {req.label}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-role">Account Role</label>
            <div className="relative">
              <span className="absolute" style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
                <Shield size={18} />
              </span>
              <select id="signup-role" name="role" className="input pl-10" value={formData.role} onChange={handleChange}>
                <option value="staff">Staff Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-2" disabled={loading} id="signup-submit-btn">
            {loading ? (<><span className="spinner" /> Creating Account...</>) : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign In</Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/home" style={{ fontSize: "0.8125rem", color: "var(--text-faint)", fontWeight: 500 }}>← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
