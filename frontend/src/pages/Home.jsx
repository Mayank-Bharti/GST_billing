import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Users,
  Package,
  TrendingUp,
  Receipt,
  Gem,
  Star,
  Menu,
  X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: FileText,
    title: "GST Invoicing",
    description: "Generate professional GST-compliant invoices with CGST, SGST & IGST auto-calculated for gold, silver & diamond items.",
    color: "#c9a84c",
  },
  {
    icon: Gem,
    title: "Jewellery Inventory",
    description: "Track gold, silver, diamond & gemstone stock with weight, purity (karat), and making charge details.",
    color: "#b76e79",
  },
  {
    icon: Users,
    title: "Customer Records",
    description: "Maintain complete client profiles with GSTIN, purchase history, and preferred jewellery categories.",
    color: "#5b7fb5",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Real-time dashboards with revenue tracking, daily gold rate impact, and monthly sales performance.",
    color: "#d4a853",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "Role-based admin and staff access with full audit trails to protect sensitive financial data.",
    color: "#4a9e7e",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed — instant invoice generation, real-time stock updates, and blazing-fast search.",
    color: "#e8d48b",
  },
];

const stats = [
  { value: "100%", label: "GST Compliant", icon: CheckCircle2 },
  { value: "< 2s", label: "Invoice Generation", icon: Receipt },
  { value: "24/7", label: "Secure Access", icon: Shield },
  { value: "Real-time", label: "Stock Tracking", icon: TrendingUp },
];

const Home = () => {
  const { user } = useAuth();
  const [mobileNav, setMobileNav] = React.useState(false);

  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh", overflow: "hidden" }}>
      {/* Animated Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ===== Navbar ===== */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0.875rem 1.25rem",
          backdropFilter: "blur(20px) saturate(1.5)",
          WebkitBackdropFilter: "blur(20px) saturate(1.5)",
          borderBottom: "1px solid var(--border-gold)",
          background: "rgba(10, 10, 15, 0.8)",
        }}
      >
        <div className="container flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #c9a84c, #e8d48b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(201, 168, 76, 0.2)",
              }}
            >
              <Gem size={20} color="#0a0a0f" />
            </div>
            <div>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.01em", display: "block", lineHeight: 1.2 }}>
                Mayank Madhuri
              </span>
              <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--primary)", fontWeight: 600 }}>
                Jewellers
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="flex items-center gap-3 nav-cta-desktop" style={{ display: "flex" }}>
            {user ? (
              <Link to="/" className="btn btn-primary" style={{ width: "auto", padding: "0.6rem 1.5rem", fontSize: "0.875rem" }}>
                Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ width: "auto", padding: "0.6rem 1.5rem", fontSize: "0.875rem", border: "none" }}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" style={{ width: "auto", padding: "0.6rem 1.5rem", fontSize: "0.875rem" }}>
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn nav-cta-mobile"
            style={{ display: "none" }}
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle menu"
          >
            {mobileNav ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              borderTop: "1px solid var(--border-gold)",
              marginTop: "0.5rem",
            }}
          >
            {user ? (
              <Link to="/" className="btn btn-primary" onClick={() => setMobileNav(false)}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileNav(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMobileNav(false)}>
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </motion.nav>

      {/* ===== Hero Section ===== */}
      <section style={{ paddingTop: "9rem", paddingBottom: "4rem", position: "relative" }}>
        <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center mb-6">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(201, 168, 76, 0.06)",
                  border: "1px solid rgba(201, 168, 76, 0.15)",
                  fontSize: "0.8125rem",
                  color: "var(--primary-light)",
                  fontWeight: 500,
                }}
              >
                <Gem size={14} style={{ color: "var(--primary)" }} />
                Trusted Jewellery Billing Platform
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              style={{
                fontSize: "clamp(2rem, 6vw, 4rem)",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
                maxWidth: 800,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Billing & Inventory for{" "}
              <span className="gradient-text-gold">Mayank Madhuri</span>
              <br />
              <span className="gradient-text-warm">Jewellers</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              custom={2}
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.125rem)",
                color: "var(--text-muted)",
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "2.5rem",
                lineHeight: 1.7,
              }}
            >
              Generate GST-compliant invoices, manage gold & diamond inventory,
              track customers & finances — all from one elegant platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-4 hero-cta-group" style={{ flexWrap: "wrap" }}>
              <Link
                to={user ? "/" : "/signup"}
                className="btn btn-primary"
                style={{
                  width: "auto",
                  padding: "0.9rem 2.25rem",
                  fontSize: "1rem",
                  borderRadius: "var(--radius-full)",
                }}
              >
                {user ? "Go to Dashboard" : "Start Free"}
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="btn btn-secondary"
                style={{
                  width: "auto",
                  padding: "0.9rem 2.25rem",
                  fontSize: "1rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-gold)",
                }}
              >
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginTop: "3.5rem", maxWidth: 900, marginLeft: "auto", marginRight: "auto", position: "relative" }}
          >
            <div
              className="glass"
              style={{
                padding: "1.25rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid rgba(201, 168, 76, 0.12)",
                boxShadow: "0 20px 80px rgba(201, 168, 76, 0.08), 0 0 0 1px rgba(201, 168, 76, 0.05)",
              }}
            >
              {/* Mock titlebar */}
              <div className="flex items-center gap-2 mb-4" style={{ paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-color)" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#e05252" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#d4a853" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4a9e7e" }} />
                <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.02em" }}>
                  Mayank Madhuri Jewellers — Dashboard
                </span>
              </div>

              {/* Mock dashboard content */}
              <div className="mock-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {[
                  { label: "Today's Sales", value: "₹3,48,500", change: "+12.5%", color: "#c9a84c" },
                  { label: "Gold Stock", value: "2.4 kg", change: "22K & 24K", color: "#e8d48b" },
                  { label: "Invoices", value: "156", change: "This month", color: "#b76e79" },
                  { label: "Customers", value: "89", change: "+5 new", color: "#4a9e7e" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(15, 15, 22, 0.7)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.875rem",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>{stat.label}</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.15rem" }}>{stat.value}</p>
                    <p style={{ fontSize: "0.625rem", color: stat.color }}>{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Mock chart area */}
              <div
                style={{
                  background: "rgba(15, 15, 22, 0.7)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  border: "1px solid var(--border-subtle)",
                  height: 140,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.4rem",
                  paddingBottom: "1rem",
                }}
              >
                {[35, 52, 48, 65, 42, 78, 55, 90, 68, 85, 72, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                    style={{
                      flex: 1,
                      background: `linear-gradient(to top, var(--primary), rgba(201, 168, 76, ${0.2 + (h / 100) * 0.8}))`,
                      borderRadius: "3px 3px 0 0",
                      minHeight: 4,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Glow effect */}
            <div style={{ position: "absolute", inset: "20%", background: "radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, transparent 70%)", zIndex: -1, filter: "blur(40px)" }} />
          </motion.div>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section style={{ padding: "3rem 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="stats-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="glass glass-hover"
                style={{ padding: "1.25rem", textAlign: "center", cursor: "default" }}
              >
                <stat.icon size={26} style={{ color: "var(--primary)", margin: "0 auto 0.625rem" }} />
                <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "0.2rem" }}>{stat.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" style={{ padding: "4rem 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} className="uppercase text-sm font-semibold mb-2" style={{ color: "var(--primary)", letterSpacing: "0.12em" }}>
              Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", marginBottom: "0.75rem" }}
            >
              Built for <span className="gradient-text-gold">Jewellery</span> Businesses
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: "var(--text-muted)", maxWidth: 520, margin: "0 auto", fontSize: "0.95rem" }}>
              Everything Mayank Madhuri Jewellers needs to manage billing, inventory, and customers professionally.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="features-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="glass glass-hover" style={{ padding: "1.75rem", cursor: "default" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: `${feature.color}10`,
                    border: `1px solid ${feature.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <feature.icon size={22} style={{ color: feature.color }} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem" }}>{feature.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section style={{ padding: "4rem 0 6rem", position: "relative", zIndex: 1 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass text-center"
            style={{ padding: "3rem 1.5rem", borderRadius: "var(--radius-xl)", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(201, 168, 76, 0.08), transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "0.75rem" }}>
                Ready to Modernize Your Jewellery Business?
              </h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.75rem", fontSize: "0.95rem", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                Start generating professional invoices and managing your inventory effortlessly.
              </p>
              <Link
                to={user ? "/" : "/signup"}
                className="btn btn-primary"
                style={{ width: "auto", padding: "0.85rem 2.25rem", fontSize: "1rem", borderRadius: "var(--radius-full)", display: "inline-flex" }}
              >
                {user ? "Open Dashboard" : "Get Started Free"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: "1px solid var(--border-gold)", padding: "1.5rem 0", position: "relative", zIndex: 1 }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div className="flex items-center gap-2">
            <Gem size={16} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: "0.9rem" }}>Mayank Madhuri Jewellers</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
            © {new Date().getFullYear()} Mayank Madhuri Jewellers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
