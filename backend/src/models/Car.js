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
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  submittedByRole: { type: String, enum: ["Admin", "Vendeur"], default: "Admin" },
  moderationStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Hidden"],
    default: "Approved",
    index: true
  },
  moderationNote: { type: String, default: "" },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  accountHidden: { type: Boolean, default: false, index: true },
  lastSellerEditAt: Date,
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  brand: { type: String, required: true, index: true },
  model: { type: String, required: true },
  category: { type: String, required: true, index: true },
  bodyType: { type: String, default: "", index: true },
  trim: { type: String, default: "" },
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
  interiorColor: { type: String, default: "" },
  cylinders: { type: Number, min: 1, max: 24, default: null },
  doors: { type: Number, min: 1, max: 20, default: null },
  seats: { type: Number, min: 1, max: 100, default: null },
  steeringSide: { type: String, default: "" },
  wheelSize: { type: String, default: "" },
  location: { type: String, default: "" },
  exportStatus: { type: String, default: "" },
  serviceHistory: { type: String, default: "" },
  drivetrain: String,
  powerHp: Number,
  powerKw: Number,
  engineCapacity: { type: Number, min: 0.5, max: 10, default: null, index: true },
  regionalSpecs: {
    type: String,
    enum: ["", "GCC", "European", "American", "Canadian", "Japanese", "Korean", "Chinese", "Australian", "Other"],
    default: "",
    index: true
  },
  price: { type: Number, default: null, index: true },
  sellerPrice: { type: Number, default: null },
  serviceFee: { type: Number, default: 17000, min: 0 },
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
  safety: [String],
  features: [{
    label: String,
    value: String
  }],
  promoted: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  soldAt: Date
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
