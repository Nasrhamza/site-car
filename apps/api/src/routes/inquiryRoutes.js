import { Router } from "express";
import { createInquiry, getInquiries } from "../controllers/inquiryController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
router.post("/", createInquiry);
router.get("/", protect, authorize("Admin"), getInquiries);

export default router;
