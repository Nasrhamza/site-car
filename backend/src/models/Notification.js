import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  audience: {
    type: String,
    enum: ["Admin", "Vendeur"],
    default: "Admin",
    index: true
  },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  type: {
    type: String,
    enum: ["SellerAccountRequested", "SellerCarSubmitted", "SellerCarUpdated", "System"],
    required: true,
    index: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", default: null },
  read: { type: Boolean, default: false, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
