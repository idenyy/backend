import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getProfile,
  updateProfile,
  addFavoriteProduct,
  removeFavoriteProduct,
  deleteProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", protect, getProfile);
router.put("/:id", protect, updateProfile);
router.delete("/", protect, deleteProfile);

router.post("/favorites/:id", protect, addFavoriteProduct);
router.delete("/favorites/remove", protect, removeFavoriteProduct);

export default router;
