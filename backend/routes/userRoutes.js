import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isUser } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👤 User Routes
router.get("/profile", protect, isUser, getUserProfile);
router.put("/profile", protect, isUser, updateUserProfile);
router.delete("/profile", protect, isUser, deleteUserAccount);

export default router;