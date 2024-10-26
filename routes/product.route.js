import express from "express";

import { protect } from "../middleware/protect.js";
import { protectAdmin } from "../middleware/protectAdmin.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByQuery,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", protect, protectAdmin, createProduct);
router.put("/:id", protect, protectAdmin, updateProduct);
router.delete("/:id", protect, protectAdmin, deleteProduct);

router.get("/", getProductByQuery);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
