import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE FIRST LINE

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bikeRoutes from "./routes/bikeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// ✅ Connect Database
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "https://e-bike-iota.vercel.app/",
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🚀 E-Bike Rental API is Running...");
});

// ❌ 404
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ⚠️ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: "Server Error",
    error: err.message,
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});