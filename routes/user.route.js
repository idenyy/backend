import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getProfile,
  updateProfile,
  addFavoriteProduct,
  removeFavoriteProduct,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", protect, getProfile);

router.put("/:id", protect, updateProfile);

router.post("/favorites/add", protect, addFavoriteProduct);

router.delete("/favorites/remove", protect, removeFavoriteProduct);

export default router;
