import mongoose from "mongoose";
import { DEFAULT_FUEL_TYPE, isAllowedFuelTypeValue, normalizeFuelTypeValue } from "../utils/fuel.js";

function normalizePriceType(value) {
  const input = String(value || "").trim().toLowerCase();
  if (input.includes("demande") || input.includes("request")) return "Sur demande";
  return input.includes("negoc") ? "Negociable" : "Prix fixe";
}

function normalizeAvailability(value) {
  const input = String(value || "").trim().toLowerCase();

  if (input.includes("vend")) return "Vendu";
  if (input.includes("masq")) return "Masque";
  if (input.includes("reserv")) return "Reserve";

  return "Disponible";
}

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  brand: { type: String, required: true, index: true },
  model: { type: String, required: true },
  category: { type: String, required: true, index: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelType: {
    type: String,
    default: DEFAULT_FUEL_TYPE,
    index: true,
    set: normalizeFuelTypeValue,
    validate: {
      validator: isAllowedFuelTypeValue,
      message: "Type de carburant invalide"
    }
  },
  transmission: { type: String, required: true },
  gearbox: { type: String, required: true },
  exteriorColor: { type: String, required: true },
  doors: Number,
  seats: Number,
  drivetrain: String,
  powerHp: Number,
  powerKw: Number,
  engineCapacity: { type: Number, min: 0.5, max: 10, default: null, index: true },
  regionalSpecs: {
    type: String,
    enum: ["GCC", "European", "American", "Canadian", "Japanese", "Korean", "Chinese", "Australian", "Other"],
    default: "Other",
    index: true
  },
  price: { type: Number, default: null, index: true },
  priceType: {
    type: String,
    default: "Prix fixe",
    set: normalizePriceType
  },
  status: {
    type: String,
    default: "Disponible",
    set: normalizeAvailability
  },
  availability: {
    type: String,
    default: "Disponible",
    set: normalizeAvailability
  },
  badges: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  views: { type: Number, default: 0 },
  liveWatchers: { type: Number, default: 0 },
  description: String,
  shortDescription: String,
  images: [{ url: String, alt: String }],
  videoUrl: String,
  pdfUrl: String,
  equipment: [String],
  features: [{
    label: String,
    value: String
  }],
  promoted: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  soldAt: Date
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
