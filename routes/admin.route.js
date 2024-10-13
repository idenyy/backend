import express from "express";

import { protect } from "../middleware/protect.js";
import { protectAdmin } from "../middleware/protectAdmin.js";
import {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  updateAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", protect, protectAdmin, getAllAdmins);

router.post("/create", protect, protectAdmin, createAdmin);

router.put("/:id", protect, protectAdmin, updateAdmin);

router.delete("/:id", protect, protectAdmin, deleteAdmin);

export default router;
