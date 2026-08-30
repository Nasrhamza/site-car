import Notification from "../models/Notification.js";
import Car from "../models/Car.js";

function sellerScope(req) {
  return { audience: "Vendeur", recipient: req.user.id };
}

export async function listSellerNotifications(req, res) {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
  const scope = sellerScope(req);
  const moderatedCars = await Car.find({
    owner: req.user.id,
    moderationStatus: { $in: ["Approved", "Rejected"] }
  }).select("_id name moderationStatus moderationNote").lean();

  if (moderatedCars.length) {
    const existing = await Notification.find({
      ...scope,
      type: "System",
      car: { $in: moderatedCars.map((car) => car._id) }
    }).select("car metadata.moderationStatus").lean();
    const existingKeys = new Set(existing.map((item) => `${item.car}:${item.metadata?.moderationStatus || ""}`));
    const missing = moderatedCars.filter((car) => !existingKeys.has(`${car._id}:${car.moderationStatus}`));

    if (missing.length) {
      await Notification.insertMany(missing.map((car) => ({
        ...scope,
        type: "System",
        title: car.moderationStatus === "Approved" ? "Vehicle approved" : "Vehicle rejected",
        message: car.moderationStatus === "Approved"
          ? `${car.name} has been approved and published.`
          : `${car.name} was rejected.${car.moderationNote ? ` Reason: ${car.moderationNote}` : ""}`,
        car: car._id,
        metadata: { moderationStatus: car.moderationStatus, moderationNote: car.moderationNote || "" }
      })));
    }
  }

  const [items, unread] = await Promise.all([
    Notification.find(scope)
      .populate("car", "name slug brand model year images moderationStatus moderationNote")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Notification.countDocuments({ ...scope, read: false })
  ]);
  res.json({ items, unread });
}

export async function markSellerNotificationRead(req, res) {
  const item = await Notification.findOneAndUpdate(
    { ...sellerScope(req), _id: req.params.id },
    { read: true },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Notification introuvable" });
  res.json({ item });
}

export async function markAllSellerNotificationsRead(req, res) {
  await Notification.updateMany({ ...sellerScope(req), read: false }, { read: true });
  res.json({ message: "Notifications marquees comme lues" });
}

export async function deleteSellerNotification(req, res) {
  const item = await Notification.findOneAndDelete({ ...sellerScope(req), _id: req.params.id });
  if (!item) return res.status(404).json({ message: "Notification introuvable" });
  res.json({ message: "Notification supprimee", id: item._id });
}

export async function deleteAllSellerNotifications(req, res) {
  const result = await Notification.deleteMany(sellerScope(req));
  res.json({ message: "Notifications supprimees", deleted: result.deletedCount || 0 });
}
