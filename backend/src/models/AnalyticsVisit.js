import mongoose from "mongoose";

const analyticsVisitSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, trim: true, maxlength: 100, index: true },
    sessionId: { type: String, required: true, trim: true, maxlength: 100, index: true },
    path: { type: String, required: true, trim: true, maxlength: 500, index: true },
    referrer: { type: String, default: "", trim: true, maxlength: 1000 },
    referrerHost: { type: String, default: "Direct", trim: true, maxlength: 255 },
    ip: { type: String, default: "Unknown", trim: true, maxlength: 100 },
    country: { type: String, default: "Unknown", trim: true, maxlength: 120 },
    countryCode: { type: String, default: "", trim: true, uppercase: true, maxlength: 3 },
    region: { type: String, default: "", trim: true, maxlength: 160 },
    city: { type: String, default: "Unknown", trim: true, maxlength: 160 },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    timezone: { type: String, default: "", trim: true, maxlength: 100 },
    isp: { type: String, default: "", trim: true, maxlength: 200 },
    device: { type: String, default: "Unknown", trim: true, maxlength: 50 },
    browser: { type: String, default: "Unknown", trim: true, maxlength: 80 },
    os: { type: String, default: "Unknown", trim: true, maxlength: 80 },
    language: { type: String, default: "", trim: true, maxlength: 35 },
    screenWidth: { type: Number, default: null, min: 0, max: 20000 },
    screenHeight: { type: Number, default: null, min: 0, max: 20000 }
  },
  { timestamps: true }
);

analyticsVisitSchema.index({ createdAt: -1 });
analyticsVisitSchema.index({ sessionId: 1, createdAt: -1 });
analyticsVisitSchema.index({ visitorId: 1, createdAt: -1 });
analyticsVisitSchema.index({ countryCode: 1, createdAt: -1 });
analyticsVisitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export default mongoose.model("AnalyticsVisit", analyticsVisitSchema);
