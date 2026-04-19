import path from "path";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDB, isDatabaseConnected } from "./config/db.js";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { ensureAdminUser } from "./services/adminBootstrap.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import Car from "./models/Car.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.CLIENT_URL, credentials: true }
});

async function syncWatchers(carId, watchers) {
  if (!isDatabaseConnected()) {
    return;
  }

  try {
    await Car.findByIdAndUpdate(carId, { liveWatchers: watchers });
  } catch (error) {
    console.error("Watcher sync error:", error);
  }
}

app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 150 }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "harou-hedwani-api",
    company: "HAROU HEDWANI",
    health: "/api/health"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "harou-hedwani-api",
    database: isDatabaseConnected() ? "connected" : "disconnected"
  });
});

app.use("/api", (req, res, next) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: "Service temporairement indisponible. La base de donnees n'est pas connectee."
    });
  }

  next();
}, routes);

io.on("connection", (socket) => {
  socket.on("join_car_room", async (carId) => {
    socket.join(carId);

    const room = io.sockets.adapter.rooms.get(carId);
    const watchers = room ? room.size : 1;

    await syncWatchers(carId, watchers);
    io.to(carId).emit("car_watchers", { carId, watchers });
  });

  socket.on("leave_car_room", async (carId) => {
    socket.leave(carId);

    const room = io.sockets.adapter.rooms.get(carId);
    const watchers = room ? room.size : 0;

    await syncWatchers(carId, watchers);
    io.to(carId).emit("car_watchers", { carId, watchers });
  });
});

app.use(notFound);
app.use(errorHandler);

server.on("error", (error) => {
  console.error("Server start error:", error);
  process.exit(1);
});

server.listen(env.PORT, () => {
  console.log(`API lancee sur http://localhost:${env.PORT}`);
});

connectDB()
  .then(() => ensureAdminUser())
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
