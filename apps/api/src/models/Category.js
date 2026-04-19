// Catégories de voitures affichées avec icônes.
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: String,
  description: String
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
