import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import sharp from "sharp";

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

    const mimeType = String(file.mimetype || "").toLowerCase();
    const extension = path.extname(file.originalname || "").toLowerCase();
    const imageExtensions = new Set([
      ".jpg", ".jpeg", ".jfif", ".png", ".webp", ".avif", ".heic", ".heif", ".tif", ".tiff", ".bmp", ".gif"
    ]);

    // Mobile browsers sometimes report valid photos as image/jpg, a HEIC
    // variant, or the generic application/octet-stream. Sharp validates the
    // actual file contents before anything is kept on the server.
    if (!mimeType.startsWith("image/") && !(mimeType === "application/octet-stream" && imageExtensions.has(extension))) {
      return cb(new Error("Only vehicle images are accepted."));
    }

    return cb(null, true);
  }
});

export function uploadVehicleImages(req, res, next) {
  upload.any()(req, res, async (error) => {
    try {
      if (error) throw error;

      for (const file of req.files || []) {
        const parsed = path.parse(file.path);
        const optimizedPath = path.join(parsed.dir, `${parsed.name}-optimized.webp`);

        await sharp(file.path)
          .rotate()
          .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toFile(optimizedPath);

        await fs.promises.unlink(file.path);
        const stats = await fs.promises.stat(optimizedPath);
        file.filename = path.basename(optimizedPath);
        file.path = optimizedPath;
        file.size = stats.size;
        file.mimetype = "image/webp";
      }

      return next();
    } catch (processingError) {
      await Promise.allSettled(
        (req.files || []).flatMap((file) => {
          const parsed = path.parse(file.path);
          return [file.path, path.join(parsed.dir, `${parsed.name}-optimized.webp`)].map((filePath) =>
            fs.promises.unlink(filePath)
          );
        })
      );

      const message = processingError instanceof multer.MulterError
        ? processingError.code === "LIMIT_FILE_SIZE"
          ? "Each vehicle photo must be smaller than 20 MB."
          : "One or more vehicle photos could not be uploaded."
        : processingError.message || "The vehicle photos could not be uploaded.";

      return res.status(400).json({ message });
    }
  });
}

export default upload;
