import { Router } from "express";
import {
  adminLogin,
  changeAdminPassword,
  login,
  me,
  register
} from "../controllers/authController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.put("/admin/change-password", protect, authorize("Admin"), changeAdminPassword);
router.get("/me", protect, me);

export default router;
