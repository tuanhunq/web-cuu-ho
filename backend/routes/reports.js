import express from 'express';
import { createReport, getReports, updateReportStatus, deleteReport } from '../controllers/reportController.js';
import { auth } from '../utils/auth.js';

const router = express.Router();

router.post('/', auth, createReport);
router.get('/', getReports);
router.put('/:id/status', auth, updateReportStatus);
router.delete('/:id', auth, deleteReport);

export default router;