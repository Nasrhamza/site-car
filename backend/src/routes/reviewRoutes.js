import { Router } from "express";
import { createReview, getApprovedReviews } from "../controllers/reviewController.js";

const router = Router();
router.get("/", getApprovedReviews);
router.post("/", createReview);

export default router;
