import { Router } from "express";
import { getAedToTndRate } from "../controllers/exchangeRateController.js";

const router = Router();

router.get("/aed-tnd", getAedToTndRate);

export default router;
