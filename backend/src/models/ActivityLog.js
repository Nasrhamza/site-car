// Journal d'activité admin pour audit.
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  actor: String,
  action: String,
  targetType: String,
  targetId: String,
  details: Object
}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);
