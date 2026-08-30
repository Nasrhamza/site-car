// Point central de tous les modules API REST.
import { Router } from "express";
import authRoutes from "./authRoutes.js";
import carRoutes from "./carRoutes.js";
import adminRoutes from "./adminRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import inquiryRoutes from "./inquiryRoutes.js";
import postRoutes from "./postRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import exchangeRateRoutes from "./exchangeRateRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import sellerRoutes from "./sellerRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cars", carRoutes);
router.use("/admin", adminRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/posts", postRoutes);
router.use("/reviews", reviewRoutes);
router.use("/exchange-rates", exchangeRateRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/seller", sellerRoutes);

export default router;
