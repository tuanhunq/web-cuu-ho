//API xử lý cứu hộ
// server/routes/rescue.js
import express from "express";
import { createReport, listReports, updateReportStatus } from "../controllers/rescueController.js";
import { authMiddleware, adminOnly } from "../utils/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createReport); // user must be authenticated to create (demo: allow anonymous by adjusting)
router.get("/", authMiddleware, adminOnly, listReports); // admin list
router.patch("/:id", authMiddleware, adminOnly, updateReportStatus);

export default router;
