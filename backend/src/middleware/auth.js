// Middleware JWT + controle des roles.
import { verifyAccessToken } from "../utils/tokens.js";

export function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Non autorise" });
    }

    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acces interdit" });
    }

    next();
  };
}
