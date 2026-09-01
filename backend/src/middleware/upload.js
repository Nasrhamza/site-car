import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDir = path.join(process.cwd(), "src", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const extension = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "vehicle";
    cb(null, `${Date.now()}-${randomUUID()}-${safeName}${extension.toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: function (_req, file, cb) {
    if (!["images", "image"].includes(file.fieldname)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }

    if (!String(file.mimetype || "").startsWith("image/")) {
      return cb(new Error("Only vehicle images are accepted."));
    }

    return cb(null, true);
  }
});

export function uploadVehicleImages(req, res, next) {
  upload.any()(req, res, (error) => {
    if (!error) {
      if (req.user?.role === "Vendeur") {
        let existingCount = 0;
        try {
          const existing = JSON.parse(req.body?.existingImages || "[]");
          existingCount = Array.isArray(existing) ? existing.length : 0;
        } catch (_parseError) {
          existingCount = 0;
        }

        if (existingCount + (req.files?.length || 0) > 12) {
          (req.files || []).forEach((file) => fs.unlink(file.path, () => undefined));
          return res.status(400).json({ message: "Seller listings can contain up to 12 vehicle photos." });
        }
      }

      return next();
    }

    const message = error instanceof multer.MulterError
      ? error.code === "LIMIT_FILE_SIZE"
          ? "Each vehicle photo must be smaller than 20 MB."
          : "One or more vehicle photos could not be uploaded."
      : error.message || "The vehicle photos could not be uploaded.";

    return res.status(400).json({ message });
  });
}

export default upload;
