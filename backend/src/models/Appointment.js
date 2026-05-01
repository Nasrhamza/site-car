// Rendez-vous showroom / essai / expertise.
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  phone: String,
  date: Date,
  note: String,
  status: {
    type: String,
    enum: ["confirmé", "annulé", "terminé", "en attente"],
    default: "en attente"
  }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
