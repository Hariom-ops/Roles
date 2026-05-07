import express from "express";
import {
  getAllUsers,
  toggleUserStatus,
  getAllBikesAdmin,
  deleteBikeAdmin,
  getAllBookings,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👑 Admin Routes
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/user/:id/toggle", protect, isAdmin, toggleUserStatus);

router.get("/bikes", protect, isAdmin, getAllBikesAdmin);
router.delete("/bike/:id", protect, isAdmin, deleteBikeAdmin);

router.get("/bookings", protect, isAdmin, getAllBookings);

export default router;