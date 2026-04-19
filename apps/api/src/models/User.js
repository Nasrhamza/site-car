// Modele utilisateur avec roles et donnees CRM.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  phone: String,
  password: { type: String, required: true },
  avatar: String,
  role: {
    type: String,
    enum: ["Admin", "Gestionnaire", "Vendeur", "Client"],
    default: "Client"
  },
  provider: { type: String, default: "credentials" },
  emailVerified: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
  alerts: [{
    brand: String,
    category: String,
    fuelType: String,
    maxPrice: Number
  }]
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
