import express from "express";
import {
  signup,
  login,
  logout,
  authCheck,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/me", protect, authCheck);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
