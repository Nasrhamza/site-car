import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointmentController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
router.post("/", createAppointment);
router.get("/", protect, authorize("Admin"), getAppointments);

export default router;
