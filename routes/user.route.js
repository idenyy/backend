import express from "express";

import { protect } from "../middleware/protect.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", protect, getProfile);
router.post("/:id", protect, updateProfile);

export default router;
