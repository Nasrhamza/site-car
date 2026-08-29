// Middleware JWT + controle des roles.
import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Non autorise" });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id).select("name email role accountStatus deletedAt");

    if (!user || user.deletedAt) {
      return res.status(401).json({ message: "Compte introuvable" });
    }

    const accountStatus = user.accountStatus || "Active";
    if (user.role !== "Admin" && accountStatus !== "Active") {
      const messages = {
        Pending: "Votre compte vendeur attend la validation de l'administrateur",
        Suspended: "Votre compte vendeur est suspendu",
        Banned: "Votre compte vendeur est bloque"
      };
      return res.status(403).json({ message: messages[accountStatus] || "Compte inactif", accountStatus });
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

export async function optionalProtect(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return next();

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id).select("name email role accountStatus deletedAt");
    if (user && !user.deletedAt && (user.role === "Admin" || (user.accountStatus || "Active") === "Active")) {
      req.user = { id: String(user._id), name: user.name, email: user.email, role: user.role, accountStatus: user.accountStatus || "Active" };
    }
  } catch (_error) {
    // Public reads remain available when an optional token is missing or expired.
  }
  next();
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acces interdit" });
    }

    next();
  };
}
