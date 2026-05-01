// Middleware de gestion d'erreurs uniforme.
export function notFound(req, res) {
  res.status(404).json({ message: "Route introuvable" });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur"
  });
}
