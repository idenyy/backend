import express from "express";
import {
  signup,
  login,
  logout,
  authCheck,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, authCheck);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
