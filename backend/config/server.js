import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import "./passport.js";
import userRoutes from "../routes/userRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
import invoiceRoutes from "../routes/invoiceRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan("dev"));

app.use(session({
  secret: "session-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);

export default app;
