import express from "express";
import {
  createBooking,
  getUserBookings,
  getSellerBookings,
  cancelBooking,
  createOrder,        // ✅ ADD THIS
  verifyPayment,      // ✅ ADD THIS
} from "../controllers/bookingContoller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👤 User
router.post("/", protect, authorizeRoles("user"), createBooking);
router.get("/my", protect, authorizeRoles("user"), getUserBookings);
router.delete("/:id", protect, authorizeRoles("user"), cancelBooking);

// 🏪 Seller
router.get(
  "/seller",
  protect,
  authorizeRoles("seller"),
  getSellerBookings
);

// 💰 Payment
router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;