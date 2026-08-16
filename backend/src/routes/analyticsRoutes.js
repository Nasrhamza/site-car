import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getAnalyticsOverview, trackVisit } from "../controllers/analyticsController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
const analyticsWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many analytics events" }
});

router.post("/visit", analyticsWriteLimiter, trackVisit);
router.get("/overview", protect, authorize("Admin"), getAnalyticsOverview);

export default router;
