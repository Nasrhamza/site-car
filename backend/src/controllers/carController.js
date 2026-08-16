import Car from "../models/Car.js";
import Inquiry from "../models/Inquiry.js";
import { makeSlug } from "../utils/slug.js";
import { getCategoryAliases, normalizeCategoryValue } from "../utils/category.js";
import { getFuelTypeAliases, isOtherFuelType, normalizeFuelTypeValue } from "../utils/fuel.js";

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return undefined;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeStatusValue(value) {
  const input = String(value || "").trim().toLowerCase();

  if (input.includes("vend")) return "Vendu";
  if (input.includes("masq")) return "Masque";
  if (input.includes("reserv")) return "Reserve";

  return "Disponible";
}

function normalizePriceTypeValue(value) {
  const input = String(value || "").trim().toLowerCase();
  if (input.includes("demande") || input.includes("request")) return "Sur demande";
  return input.includes("negoc") ? "Negociable" : "Prix fixe";
}

function getUploadedFiles(req) {
  if (Array.isArray(req?.files)) {
    return req.files;
  }

  if (req?.file) {
    return [req.file];
  }

  if (!req?.files || typeof req.files !== "object") {
    return [];
  }

  return [...(req.files.images || []), ...(req.files.image || [])];
}

function buildUploadedImages(files, fallbackAlt) {
  const safeAlt = String(fallbackAlt || "Vehicule").trim() || "Vehicule";

  return files.map((file, index) => ({
    url: `/uploads/${file.filename}`,
    alt: files.length > 1 ? `${safeAlt} ${index + 1}` : safeAlt
  }));
}

function parseExistingImages(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (!Array.isArray(parsed)) {
      return undefined;
    }

    return parsed
      .map((item) => {
        if (typeof item === "string") {
          const url = item.trim();
          return url ? { url, alt: "Vehicule" } : null;
        }

        const url = String(item?.url || "").trim();
        if (!url) {
          return null;
        }

        return {
          url,
          alt: String(item?.alt || "Vehicule").trim() || "Vehicule"
        };
      })
      .filter(Boolean);
  } catch (_error) {
    return undefined;
  }
}

function serializeCar(car) {
  const payload = typeof car?.toObject === "function" ? car.toObject() : car;
  const availability = normalizeStatusValue(payload?.availability || payload?.status);

  return {
    ...payload,
    category: normalizeCategoryValue(payload?.category),
    fuelType: normalizeFuelTypeValue(payload?.fuelType),
    status: availability,
    availability,
    priceType: normalizePriceTypeValue(payload?.priceType)
  };
}

function normalizeCarPayload(body) {
  const normalized = { ...body };

  const year = toNumber(body.year);
  const mileage = toNumber(body.mileage);
  const price = toNumber(body.price);

  if (year !== undefined) normalized.year = year;
  if (mileage !== undefined) normalized.mileage = mileage;
  if (price !== undefined) {
    normalized.price = price;
  } else {
    delete normalized.price;
  }

  if (typeof body.category === "string") {
    normalized.category = normalizeCategoryValue(body.category);
  }

  if (body.fuelType !== undefined) {
    normalized.fuelType = normalizeFuelTypeValue(body.fuelType);
  }

  const badges = toStringList(body.badges);
  const equipment = toStringList(body.equipment);

  if (badges !== undefined) normalized.badges = badges;
  if (equipment !== undefined) normalized.equipment = equipment;

  if (body.priceType !== undefined) {
    normalized.priceType = normalizePriceTypeValue(body.priceType);
    if (normalized.priceType === "Sur demande") {
      normalized.price = null;
    }
  }

  if (body.status !== undefined || body.availability !== undefined) {
    const availability = normalizeStatusValue(body.availability || body.status);
    normalized.status = availability;
    normalized.availability = availability;
  }

  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  if (imageUrl) {
    normalized.images = [{ url: imageUrl, alt: body.name || "Vehicule" }];
  }

  delete normalized.existingImages;
  delete normalized.imageUrl;

  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined)
  );
}

async function makeUniqueCarSlug(brand, model, year, excludedId) {
  const baseSlug = makeSlug(brand, model, year) || "vehicle";
  let slug = baseSlug;
  let suffix = 2;

  while (
    await Car.exists({
      slug,
      ...(excludedId ? { _id: { $ne: excludedId } } : {})
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function sendCarWriteError(res, error, fallbackMessage) {
  if (error?.name === "ValidationError") {
    const fieldLabels = {
      name: "الاسم",
      brand: "الماركة",
      model: "الموديل",
      category: "الفئة",
      year: "السنة",
      mileage: "عدد الكيلومترات",
      fuelType: "نوع الوقود",
      transmission: "الدفع / النقل",
      gearbox: "علبة السرعة",
      exteriorColor: "اللون"
    };
    const fields = Object.keys(error.errors || {}).map((field) => fieldLabels[field] || field);
    const details = fields.length ? `: ${fields.join("، ")}` : "";
    return res.status(400).json({ message: `الرجاء التثبت من الحقول المطلوبة${details}` });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      message: "يوجد إعلان آخر بنفس الرابط. أعد المحاولة وسيتم إنشاء رابط مختلف تلقائيًا."
    });
  }

  return res.status(500).json({ message: fallbackMessage });
}

export async function getCars(req, res) {
  try {
    const {
      page = 1,
      limit = 9,
      search,
      brand,
      model,
      category,
      minPrice,
      maxPrice,
      yearFrom,
      yearTo,
      minMileage,
      maxMileage,
      fuelType,
      gearbox,
      transmission,
      sort = "-createdAt"
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { model: new RegExp(search, "i") }
      ];
    }

    if (brand) query.brand = { $in: String(brand).split(",") };
    if (model) query.model = new RegExp(escapeRegex(model), "i");
    if (category) {
      query.category = { $in: getCategoryAliases(category) };
    }
    if (fuelType) {
      if (isOtherFuelType(fuelType)) {
        query.$and = [
          ...(query.$and || []),
          {
            $or: [
              { fuelType: { $exists: false } },
              { fuelType: null },
              { fuelType: "" },
              { fuelType: { $in: getFuelTypeAliases(fuelType) } }
            ]
          }
        ];
      } else {
        query.fuelType = { $in: getFuelTypeAliases(fuelType) };
      }
    }
    if (gearbox) query.gearbox = gearbox;

    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {})
      };
    }

    if (yearFrom || yearTo) {
      query.year = {
        ...(yearFrom ? { $gte: Number(yearFrom) } : {}),
        ...(yearTo ? { $lte: Number(yearTo) } : {})
      };
    }

    if (minMileage || maxMileage) {
      query.mileage = {
        ...(minMileage ? { $gte: Number(minMileage) } : {}),
        ...(maxMileage ? { $lte: Number(maxMileage) } : {})
      };
    }

    if (transmission) {
      const transmissionPattern = new RegExp(`^${escapeRegex(transmission)}$`, "i");
      query.$and = [
        ...(query.$and || []),
        { $or: [{ gearbox: transmissionPattern }, { transmission: transmissionPattern }] }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Car.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Car.countDocuments(query)
    ]);

    res.json({
      items: items.map(serializeCar),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("getCars error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des vehicules" });
  }
}

export async function getCarBySlug(req, res) {
  try {
    const car = await Car.findOne({ slug: req.params.slug });

    if (!car) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }

    // Increment views without re-validating legacy records. Some demo cars were
    // created before all current required fields existed, and `save()` made
    // their public detail page fail even though the record could be displayed.
    await Car.updateOne({ _id: car._id }, { $inc: { views: 1 } });
    car.views = (car.views || 0) + 1;

    const similar = await Car.find({
      _id: { $ne: car._id },
      $or: [{ category: { $in: getCategoryAliases(car.category) } }, { brand: car.brand }]
    }).limit(3);

    const inquiriesCount = await Inquiry.countDocuments({ car: car._id });

    res.json({ car: serializeCar(car), similar: similar.map(serializeCar), inquiriesCount });
  } catch (error) {
    console.error("getCarBySlug error:", error);
    res.status(500).json({ message: "Erreur lors du chargement du vehicule" });
  }
}

export async function getCarById(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }

    res.json(serializeCar(car));
  } catch (error) {
    console.error("getCarById error:", error);
    res.status(500).json({ message: "Erreur lors du chargement du vehicule" });
  }
}

export async function createCar(req, res) {
  try {
    const body = normalizeCarPayload(req.body);
    const slug = await makeUniqueCarSlug(body.brand, body.model, body.year);
    const uploadedImages = buildUploadedImages(
      getUploadedFiles(req),
      body.name || `${body.brand || "Vehicule"} ${body.model || ""}`.trim()
    );

    const car = await Car.create({
      ...body,
      slug,
      images: uploadedImages.length ? uploadedImages : body.images || []
    });

    res.status(201).json(serializeCar(car));
  } catch (error) {
    console.error("createCar error:", error);
    sendCarWriteError(res, error, "تعذر إضافة المركبة. حاول مرة أخرى.");
  }
}

export async function updateCar(req, res) {
  try {
    const updateData = normalizeCarPayload(req.body);
    const existingImages = parseExistingImages(req.body?.existingImages);
    const uploadedImages = buildUploadedImages(
      getUploadedFiles(req),
      req.body?.name || updateData.name || "Vehicule"
    );

    if (updateData.brand && updateData.model && updateData.year) {
      updateData.slug = await makeUniqueCarSlug(
        updateData.brand,
        updateData.model,
        updateData.year,
        req.params.id
      );
    }

    if (existingImages !== undefined || uploadedImages.length > 0) {
      updateData.images = [...(existingImages || []), ...uploadedImages];
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });

    if (!car) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }

    res.json(serializeCar(car));
  } catch (error) {
    console.error("updateCar error:", error);
    sendCarWriteError(res, error, "تعذر حفظ التعديلات. حاول مرة أخرى.");
  }
}

export async function deleteCar(req, res) {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }

    res.json({ message: "Vehicule supprime" });
  } catch (error) {
    console.error("deleteCar error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
}

export async function getFeaturedCars(req, res) {
  try {
    const cars = await Car.find({ featured: true, status: "Disponible" }).limit(6);
    res.json(cars.map(serializeCar));
  } catch (error) {
    console.error("getFeaturedCars error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des vehicules en vedette" });
  }
}
