import User from "../models/User.js";
import Car from "../models/Car.js";
import Notification from "../models/Notification.js";
import ActivityLog from "../models/ActivityLog.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function sellerPayload(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    accountStatus: user.accountStatus || "Active",
    showroomName: user.showroomName || ""
  };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload), user: payload };
}

async function logAdminAction(req, action, targetId, details = {}) {
  await ActivityLog.create({ actor: req.user.email, action, targetType: "Seller", targetId: String(targetId), details });
}

export async function listSellers(_req, res) {
  const sellers = await User.find({ role: "Vendeur", deletedAt: null }).select("-password -favorites -alerts").sort({ createdAt: -1 }).lean();
  const counts = await Car.aggregate([
    { $match: { owner: { $in: sellers.map((seller) => seller._id) } } },
    { $group: { _id: "$owner", totalCars: { $sum: 1 }, pendingCars: { $sum: { $cond: [{ $eq: ["$moderationStatus", "Pending"] }, 1, 0] } } } }
  ]);
  const countMap = new Map(counts.map((item) => [String(item._id), item]));
  res.json({
    items: sellers.map((seller) => ({
      ...seller,
      accountStatus: seller.accountStatus || "Active",
      totalCars: countMap.get(String(seller._id))?.totalCars || 0,
      pendingCars: countMap.get(String(seller._id))?.pendingCars || 0
    }))
  });
}

export async function createSeller(req, res) {
  try {
    const name = String(req.body?.name || "").trim();
    const showroomName = String(req.body?.showroomName || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const address = String(req.body?.address || "").trim();
    const password = String(req.body?.password || "");
    if (!name || !showroomName || !email || !phone || password.length < 8) {
      return res.status(400).json({ message: "Informations vendeur requises et mot de passe de 8 caracteres minimum" });
    }
    if (await User.exists({ email })) return res.status(409).json({ message: "Email deja utilise" });

    const seller = await User.create({ name, showroomName, email, phone, address, password, role: "Vendeur", accountStatus: "Active", approvedAt: new Date(), approvedBy: req.user.id });
    await logAdminAction(req, "seller.create", seller._id, { email, showroomName });
    res.status(201).json({ item: sellerPayload(seller).user });
  } catch (error) {
    console.error("createSeller error:", error);
    res.status(500).json({ message: "Impossible de creer le compte vendeur" });
  }
}

export async function updateSeller(req, res) {
  const seller = await User.findOne({ _id: req.params.id, role: "Vendeur" });
  if (!seller) return res.status(404).json({ message: "Compte vendeur introuvable" });

  const allowed = ["name", "showroomName", "phone", "address", "adminNotes"];
  allowed.forEach((field) => {
    if (req.body?.[field] !== undefined) seller[field] = String(req.body[field] || "").trim();
  });
  if (req.body?.email !== undefined) {
    const email = normalizeEmail(req.body.email);
    const duplicate = await User.exists({ email, _id: { $ne: seller._id } });
    if (duplicate) return res.status(409).json({ message: "Email deja utilise" });
    seller.email = email;
  }
  await seller.save();
  await logAdminAction(req, "seller.update", seller._id, { email: seller.email });
  res.json({ item: sellerPayload(seller).user });
}

export async function updateSellerStatus(req, res) {
  const nextStatus = String(req.body?.accountStatus || "");
  if (!["Pending", "Active", "Suspended", "Banned"].includes(nextStatus)) {
    return res.status(400).json({ message: "Statut vendeur invalide" });
  }
  const seller = await User.findOne({ _id: req.params.id, role: "Vendeur", deletedAt: null });
  if (!seller) return res.status(404).json({ message: "Compte vendeur introuvable" });

  seller.accountStatus = nextStatus;
  if (nextStatus === "Active") {
    seller.approvedAt = seller.approvedAt || new Date();
    seller.approvedBy = req.user.id;
  }
  await seller.save();
  await Car.updateMany({ owner: seller._id }, { $set: { accountHidden: nextStatus !== "Active" } });
  await logAdminAction(req, "seller.status", seller._id, { accountStatus: nextStatus });
  res.json({ message: "Statut vendeur mis a jour", accountStatus: nextStatus });
}

export async function resetSellerPassword(req, res) {
  const password = String(req.body?.password || "");
  if (password.length < 8) return res.status(400).json({ message: "Mot de passe de 8 caracteres minimum" });
  const seller = await User.findOne({ _id: req.params.id, role: "Vendeur", deletedAt: null });
  if (!seller) return res.status(404).json({ message: "Compte vendeur introuvable" });
  seller.password = password;
  await seller.save();
  await logAdminAction(req, "seller.password.reset", seller._id);
  res.json({ message: "Mot de passe vendeur reinitialise" });
}

export async function impersonateSeller(req, res) {
  const seller = await User.findOne({ _id: req.params.id, role: "Vendeur", deletedAt: null });
  if (!seller) return res.status(404).json({ message: "Compte vendeur introuvable" });
  if ((seller.accountStatus || "Active") !== "Active") return res.status(400).json({ message: "Activez le compte avant d'entrer comme vendeur" });
  await logAdminAction(req, "seller.impersonate", seller._id);
  res.json(sellerPayload(seller));
}

export async function deleteSeller(req, res) {
  const seller = await User.findOne({ _id: req.params.id, role: "Vendeur", deletedAt: null });
  if (!seller) return res.status(404).json({ message: "Compte vendeur introuvable" });
  seller.accountStatus = "Banned";
  seller.deletedAt = new Date();
  await seller.save();
  await Car.updateMany({ owner: seller._id }, { $set: { accountHidden: true } });
  await logAdminAction(req, "seller.delete", seller._id);
  res.json({ message: "Compte vendeur supprime et annonces masquees" });
}

export async function listAdminNotifications(req, res) {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
  const items = await Notification.find({ audience: "Admin" })
    .populate("actor", "name showroomName email")
    .populate("car", "name slug brand model year images price priceType moderationStatus availability status")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  const unread = await Notification.countDocuments({ audience: "Admin", read: false });
  res.json({ items, unread });
}

export async function markNotificationRead(req, res) {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, audience: "Admin" }, { read: true }, { new: true });
  if (!item) return res.status(404).json({ message: "Notification introuvable" });
  res.json({ item });
}

export async function markAllNotificationsRead(_req, res) {
  await Notification.updateMany({ audience: "Admin", read: false }, { read: true });
  res.json({ message: "Notifications marquees comme lues" });
}

export async function deleteAdminNotification(req, res) {
  const item = await Notification.findOneAndDelete({ _id: req.params.id, audience: "Admin" });
  if (!item) return res.status(404).json({ message: "Notification introuvable" });
  res.json({ message: "Notification supprimee", id: item._id });
}

export async function deleteAllAdminNotifications(_req, res) {
  const result = await Notification.deleteMany({ audience: "Admin" });
  res.json({ message: "Notifications supprimees", deleted: result.deletedCount || 0 });
}
