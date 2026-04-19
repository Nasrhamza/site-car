import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
router.get("/stats", protect, authorize("Admin"), getDashboardStats);

export default router;
