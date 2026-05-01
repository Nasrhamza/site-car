import { Router } from "express";
import {
  createInquiry,
  deleteAllInquiries,
  deleteInquiry,
  getInquiries
} from "../controllers/inquiryController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
router.post("/", createInquiry);
router.get("/", protect, authorize("Admin"), getInquiries);
router.delete("/", protect, authorize("Admin"), deleteAllInquiries);
router.delete("/:id", protect, authorize("Admin"), deleteInquiry);

export default router;
