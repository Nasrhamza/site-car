import User from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { sendMail } from "../utils/mailer.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function buildAuthPayload(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: payload
  };
}

export async function register(req, res) {
  const name = String(req.body?.name || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom, email et mot de passe sont requis" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email deja utilise" });
  }

  const user = await User.create({ name, email, password, role: "Client" });

  await sendMail({
    to: user.email,
    subject: "Bienvenue chez HAROU HEDWANI",
    html: `<h1>Bienvenue ${user.name}</h1><p>Votre compte a ete cree avec succes.</p>`
  });

  res.status(201).json({
    message: "Compte cree",
    user: { id: user._id, email: user.email, role: user.role }
  });
}

export async function login(req, res) {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  res.json(buildAuthPayload(user));
}

export async function adminLogin(req, res) {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  if (user.role !== "Admin") {
    return res.status(403).json({ message: "Compte admin requis" });
  }

  res.json(buildAuthPayload(user));
}

export async function changeAdminPassword(req, res) {
  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Mot de passe actuel et nouveau mot de passe requis" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Le nouveau mot de passe doit contenir au moins 8 caracteres" });
  }

  const user = await User.findById(req.user.id);

  if (!user || user.role !== "Admin") {
    return res.status(403).json({ message: "Compte admin requis" });
  }

  const isValidCurrentPassword = await user.matchPassword(currentPassword);
  if (!isValidCurrentPassword) {
    return res.status(400).json({ message: "Le mot de passe actuel est incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Mot de passe mis a jour avec succes" });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select("-password").populate("favorites");
  res.json(user);
}
