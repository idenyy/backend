import express from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/create", protect, createAdmin);

export default router;
