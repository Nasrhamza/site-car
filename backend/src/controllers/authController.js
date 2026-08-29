import User from "../models/User.js";
import Notification from "../models/Notification.js";
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
    name: user.name,
    accountStatus: user.accountStatus || "Active",
    showroomName: user.showroomName || ""
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: payload
  };
}

function inactiveAccountResponse(res, user) {
  const status = user.accountStatus || "Active";
  if (user.role === "Admin" || status === "Active") return false;

  const messages = {
    Pending: "Votre demande de compte attend la validation de l'administrateur",
    Suspended: "Votre compte vendeur est suspendu",
    Banned: "Votre compte vendeur est bloque"
  };
  res.status(403).json({ message: messages[status] || "Compte inactif", accountStatus: status });
  return true;
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
    subject: "Bienvenue chez ALHADUNI CARS",
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

  if (user.deletedAt) return res.status(403).json({ message: "Ce compte a ete supprime" });
  if (inactiveAccountResponse(res, user)) return;
  user.lastLoginAt = new Date();
  await user.save();

  res.json(buildAuthPayload(user));
}

export async function sellerLogin(req, res) {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  if (user.role !== "Vendeur") {
    return res.status(403).json({ message: "Compte vendeur requis" });
  }
  if (user.deletedAt) return res.status(403).json({ message: "Ce compte a ete supprime" });
  if (inactiveAccountResponse(res, user)) return;

  user.lastLoginAt = new Date();
  await user.save();
  res.json(buildAuthPayload(user));
}

export async function requestSellerAccount(req, res) {
  try {
    const name = String(req.body?.name || "").trim();
    const showroomName = String(req.body?.showroomName || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const address = String(req.body?.address || "").trim();
    const password = String(req.body?.password || "");

    if (!name || !showroomName || !email || !phone || !password) {
      return res.status(400).json({ message: "Nom, showroom, email, telephone et mot de passe sont requis" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caracteres" });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "Email deja utilise" });
    }

    const user = await User.create({
      name,
      showroomName,
      email,
      phone,
      address,
      password,
      role: "Vendeur",
      accountStatus: "Pending"
    });

    await Notification.create({
      audience: "Admin",
      type: "SellerAccountRequested",
      title: "Nouvelle demande vendeur",
      message: `${showroomName} a demande un compte vendeur`,
      actor: user._id,
      metadata: { email, phone, showroomName }
    });

    res.status(201).json({
      message: "Demande envoyee. Un administrateur doit activer votre compte.",
      accountStatus: user.accountStatus
    });
  } catch (error) {
    console.error("requestSellerAccount error:", error);
    res.status(500).json({ message: "Impossible d'envoyer la demande vendeur" });
  }
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

  if (user.deletedAt) return res.status(403).json({ message: "Compte supprime" });
  user.lastLoginAt = new Date();
  await user.save();

  res.json(buildAuthPayload(user));
}

export async function changeOwnPassword(req, res) {
  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");
  if (!currentPassword || newPassword.length < 8) {
    return res.status(400).json({ message: "Mot de passe actuel requis et nouveau mot de passe de 8 caracteres minimum" });
  }

  const user = await User.findById(req.user.id);
  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ message: "Le mot de passe actuel est incorrect" });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Mot de passe mis a jour" });
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
