import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getProfile,
  updateProfile,
  addFavoriteProduct,
  removeFavoriteProduct,
  deleteProfile,
  getFavorites,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/favorites", protect, getFavorites);

router.get("/:userId", protect, getProfile);
router.put("/:userId", protect, updateProfile);
router.delete("/", protect, deleteProfile);

// router.get("/favorites/:id", protect, getFavoriteById);
router.post("/favorites/add", protect, addFavoriteProduct);
router.delete("/favorites/:productId", protect, removeFavoriteProduct);

export default router;
