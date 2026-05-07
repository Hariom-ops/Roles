import express from "express";
import {
  getSellerDashboard,
  getSellerProfile,
  getSellerBookingHistory,
  toggleBikeAvailability,
} from "../controllers/sellerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isSeller } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🏪 Seller Routes
router.get("/dashboard", protect, isSeller, getSellerDashboard);
router.get("/profile", protect, isSeller, getSellerProfile);
router.get("/bookings", protect, isSeller, getSellerBookingHistory);

// Toggle availability
router.put("/bike/:id/toggle", protect, isSeller, toggleBikeAvailability);

export default router;