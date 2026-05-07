import express from "express";
import {
  createBike,
  getAllBikes,
  getSellerBikes,
  updateBike,
  deleteBike,
} from "../controllers/bikeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🌍 Public
router.get("/", getAllBikes);

// 🏪 Seller
router.post("/", protect, authorizeRoles("seller"), createBike);
router.get("/my", protect, authorizeRoles("seller"), getSellerBikes);

router.put("/:id", protect, authorizeRoles("seller"), updateBike);
router.delete("/:id", protect, authorizeRoles("seller"), deleteBike);

export default router;