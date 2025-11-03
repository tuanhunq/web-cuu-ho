//API xử lý cứu hộ
// server/routes/rescue.js
import express from "express";
import { createReport, listReports, updateReportStatus } from "../controllers/rescueController.js";
import { createTeam, getTeams, updateTeamStatus, deleteTeam } from "../controllers/teamController.js";
import { authMiddleware, adminOnly } from "../utils/auth.js";

const router = express.Router();

// Allow anonymous POST to create reports from public frontend; still allow authenticated users
router.post("/", (req, res, next) => {
	// if Authorization header present, try to authenticate, else continue anonymously
	const auth = req.headers.authorization || req.headers.Authorization;
	if (auth) return authMiddleware(req, res, next);
	return next();
}, createReport);

// Admin-only endpoints
router.get("/", authMiddleware, adminOnly, listReports); // admin list
router.patch("/:id", authMiddleware, adminOnly, updateReportStatus);

// Teams endpoints under /api/rescue/teams
const teamsRouter = express.Router();

// Public: list teams (supports query params)
teamsRouter.get('/', getTeams);

// Admin: create team
teamsRouter.post('/', authMiddleware, adminOnly, createTeam);

// Update team (admin or team member handled in controller)
teamsRouter.put('/:id', authMiddleware, updateTeamStatus);

// Delete team (admin only)
teamsRouter.delete('/:id', authMiddleware, adminOnly, deleteTeam);

// Mount teamsRouter onto /teams path
router.use('/teams', teamsRouter);

export default router;
