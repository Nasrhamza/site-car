// Gestion des demandes de contact véhicule.
import Inquiry from "../models/Inquiry.js";

export async function createInquiry(req, res) {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json(inquiry);
}

export async function getInquiries(req, res) {
  const items = await Inquiry.find().populate("car").sort({ createdAt: -1 });
  res.json(items);
}

export async function deleteInquiry(req, res) {
  try {
    const item = await Inquiry.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    res.json({ message: "Notification supprimee", id: req.params.id });
  } catch (error) {
    console.error("deleteInquiry error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la notification" });
  }
}

export async function deleteAllInquiries(req, res) {
  try {
    const result = await Inquiry.deleteMany({});
    res.json({
      message: "Notifications supprimees",
      deletedCount: result.deletedCount || 0
    });
  } catch (error) {
    console.error("deleteAllInquiries error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression des notifications" });
  }
}
