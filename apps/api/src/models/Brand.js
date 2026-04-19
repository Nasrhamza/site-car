// Référentiel des marques automobiles.
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: String
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
