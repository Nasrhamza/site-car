import { Router } from "express";
import {
  adminLogin,
  changeAdminPassword,
  changeOwnPassword,
  login,
  me,
  register,
  requestSellerAccount,
  sellerLogin
} from "../controllers/authController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/seller/login", sellerLogin);
router.post("/seller/request", requestSellerAccount);
router.put("/admin/change-password", protect, authorize("Admin"), changeAdminPassword);
router.put("/change-password", protect, changeOwnPassword);
router.get("/me", protect, me);

export default router;
