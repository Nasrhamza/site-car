import User from "../models/User.js";
import { env } from "../config/env.js";

export async function ensureAdminUser() {
  const email = String(env.ADMIN_BOOTSTRAP_EMAIL || "").trim().toLowerCase();
  const password = String(env.ADMIN_BOOTSTRAP_PASSWORD || "").trim();

  if (!email || !password) {
    return;
  }

  const existingAdmin = await User.findOne({ role: "Admin" }).select("email");
  if (existingAdmin) {
    console.log(`Admin bootstrap ignore: un admin existe deja (${existingAdmin.email})`);
    return;
  }

  const existingUser = await User.findOne({ email }).select("role");
  if (existingUser) {
    console.warn(`Admin bootstrap ignore: ${email} existe deja avec le role ${existingUser.role}`);
    return;
  }

  await User.create({
    name: String(env.ADMIN_BOOTSTRAP_NAME || "").trim() || "HAROU HEDWANI Admin",
    email,
    password,
    role: "Admin",
    emailVerified: true
  });

  console.log(`Admin bootstrap cree pour ${email}`);
}
