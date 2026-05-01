import Car from "../models/Car.js";
import Inquiry from "../models/Inquiry.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

function statusQuery(fragment) {
  const matcher = new RegExp(fragment, "i");

  return {
    $or: [{ status: matcher }, { availability: matcher }]
  };
}

export async function getDashboardStats(req, res) {
  const [totalCars, soldCars, reservedCars, totalUsers, inquiries, appointments, topViewed] =
    await Promise.all([
      Car.countDocuments(),
      Car.countDocuments(statusQuery("vend")),
      Car.countDocuments(statusQuery("reserv")),
      User.countDocuments(),
      Inquiry.countDocuments(),
      Appointment.countDocuments(),
      Car.find().sort({ views: -1 }).limit(5).select("name brand price views")
    ]);

  res.json({
    cards: {
      totalCars,
      soldCars,
      reservedCars,
      totalUsers,
      inquiries,
      appointments
    },
    topViewed,
    visitorsSeries: [
      { name: "Lun", value: 120 },
      { name: "Mar", value: 190 },
      { name: "Mer", value: 240 },
      { name: "Jeu", value: 300 },
      { name: "Ven", value: 410 },
      { name: "Sam", value: 530 },
      { name: "Dim", value: 480 }
    ]
  });
}
