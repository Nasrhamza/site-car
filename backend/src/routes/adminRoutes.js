import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import {
  createSeller,
  deleteAdminNotification,
  deleteAllAdminNotifications,
  deleteSeller,
  impersonateSeller,
  listAdminNotifications,
  listSellers,
  markAllNotificationsRead,
  markNotificationRead,
  resetSellerPassword,
  updateSeller,
  updateSellerStatus
} from "../controllers/sellerAdminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
router.get("/stats", protect, authorize("Admin"), getDashboardStats);
router.get("/sellers", protect, authorize("Admin"), listSellers);
router.post("/sellers", protect, authorize("Admin"), createSeller);
router.put("/sellers/:id", protect, authorize("Admin"), updateSeller);
router.patch("/sellers/:id/status", protect, authorize("Admin"), updateSellerStatus);
router.put("/sellers/:id/password", protect, authorize("Admin"), resetSellerPassword);
router.post("/sellers/:id/impersonate", protect, authorize("Admin"), impersonateSeller);
router.delete("/sellers/:id", protect, authorize("Admin"), deleteSeller);
router.get("/notifications", protect, authorize("Admin"), listAdminNotifications);
router.patch("/notifications/read-all", protect, authorize("Admin"), markAllNotificationsRead);
router.patch("/notifications/:id/read", protect, authorize("Admin"), markNotificationRead);
router.delete("/notifications", protect, authorize("Admin"), deleteAllAdminNotifications);
router.delete("/notifications/:id", protect, authorize("Admin"), deleteAdminNotification);

export default router;
