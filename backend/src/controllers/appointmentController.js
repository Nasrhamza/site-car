// Gestion des rendez-vous et email de confirmation.
import Appointment from "../models/Appointment.js";
import { sendMail } from "../utils/mailer.js";

export async function createAppointment(req, res) {
  const appointment = await Appointment.create(req.body);

  await sendMail({
    to: appointment.email,
    subject: "Confirmation de rendez-vous",
    html: `
      <h2>Votre rendez-vous est enregistré</h2>
      <p>Date demandée : ${new Date(appointment.date).toLocaleString("fr-FR")}</p>
      <p>Nous reviendrons vers vous rapidement.</p>
    `
  });

  res.status(201).json(appointment);
}

export async function getAppointments(req, res) {
  const items = await Appointment.find().populate("car").sort({ date: 1 });
  res.json(items);
}
