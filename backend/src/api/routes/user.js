//API người dùng
import express from "express";
import { register, login, profile } from "../controllers/userController.js";
import { authMiddleware } from "../../utils/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

export default router;