import { Router } from "express";
import {
  deleteAllSellerNotifications,
  deleteSellerNotification,
  listSellerNotifications,
  markAllSellerNotificationsRead,
  markSellerNotificationRead
} from "../controllers/sellerNotificationController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("Vendeur"));
router.get("/notifications", listSellerNotifications);
router.patch("/notifications/read-all", markAllSellerNotificationsRead);
router.patch("/notifications/:id/read", markSellerNotificationRead);
router.delete("/notifications", deleteAllSellerNotifications);
router.delete("/notifications/:id", deleteSellerNotification);

export default router;
