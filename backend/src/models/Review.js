// Avis clients avec modération.
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  photo: String,
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
