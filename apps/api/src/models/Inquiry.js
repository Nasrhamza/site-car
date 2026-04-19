// Demandes d'information envoyées depuis le site.
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  phone: String,
  message: String,
  status: {
    type: String,
    enum: ["nouvelle", "en attente", "traitée"],
    default: "nouvelle"
  }
}, { timestamps: true });

export default mongoose.model("Inquiry", inquirySchema);
