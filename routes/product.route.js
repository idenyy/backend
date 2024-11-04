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

import {
  addOrUpdateRating,
  getProductRating
} from "../controllers/rating.controller.js"

const router = express.Router();

router.get("/", getAllProducts);
router.get("/", getProductByQuery);
router.get("/:id", getProductById);

router.get('/rating/:productId', getProductRating);
router.post("/rating/add", protect, addOrUpdateRating);

router.post("/add", protect, protectAdmin, createProduct);
router.put("/:id", protect, protectAdmin, updateProduct);
router.delete("/:id", protect, protectAdmin, deleteProduct);



export default router;
