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
