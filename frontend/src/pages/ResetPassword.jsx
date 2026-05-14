import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-layout">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-card glass text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Password Reset!</h1>
          <p className="text-muted mb-8">Your password has been successfully updated. You can now log in with your new password.</p>
          <Link to="/login" className="btn btn-primary flex items-center justify-center gap-2">
            Proceed to Login <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="auth-card glass">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-muted">Choose a strong password for your account.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-error small rounded-lg">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="input pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Confirm New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="input pl-10"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary mt-2">
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
