// Service d'envoi d'emails (confirmation, reset password, RDV, alertes).
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: env.SMTP_USER ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  } : undefined
});

export async function sendMail({ to, subject, html }) {
  if (!env.SMTP_HOST) {
    console.log("📨 Email simulé:", { to, subject });
    return;
  }
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html
  });
}
