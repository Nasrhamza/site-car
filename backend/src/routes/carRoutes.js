import upload from "../middleware/upload.js";
import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCarBySlug,
  getCarFilterOptions,
  getCars,
  getFeaturedCars,
  getManagedCars,
  moderateCar,
  updateCarPricing,
  updateCar
} from "../controllers/carController.js";
import { authorize, optionalProtect, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getCars);
router.get("/featured", getFeaturedCars);
router.get("/filters/options", getCarFilterOptions);
router.get("/manage", protect, authorize("Admin", "Vendeur"), getManagedCars);
router.get("/by-id/:id", optionalProtect, getCarById);
router.get("/:slug", getCarBySlug);
router.post(
  "/",
  protect,
  authorize("Admin", "Vendeur"),
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "image", maxCount: 12 }
  ]),
  createCar
);
router.put(
  "/:id",
  protect,
  authorize("Admin", "Vendeur"),
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "image", maxCount: 12 }
  ]),
  updateCar
);
router.patch("/:id/moderation", protect, authorize("Admin"), moderateCar);
router.patch("/:id/pricing", protect, authorize("Admin"), updateCarPricing);
router.delete("/:id", protect, authorize("Admin", "Vendeur"), deleteCar);

export default router;
