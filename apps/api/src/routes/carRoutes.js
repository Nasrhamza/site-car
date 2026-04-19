import upload from "../middleware/upload.js";
import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCarBySlug,
  getCars,
  getFeaturedCars,
  updateCar
} from "../controllers/carController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getCars);
router.get("/featured", getFeaturedCars);
router.get("/by-id/:id", getCarById);
router.get("/:slug", getCarBySlug);
router.post("/", protect, authorize("Admin"), upload.single("image"), createCar);
router.put("/:id", protect, authorize("Admin"), upload.single("image"), updateCar);
router.delete("/:id", protect, authorize("Admin"), deleteCar);

export default router;
