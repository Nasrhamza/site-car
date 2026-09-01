import Car from "../models/Car.js";
import Inquiry from "../models/Inquiry.js";
import Notification from "../models/Notification.js";
import { makeSlug } from "../utils/slug.js";
import { getCategoryAliases, normalizeCategoryValue } from "../utils/category.js";
import { getFuelTypeAliases, isOtherFuelType, normalizeFuelTypeValue } from "../utils/fuel.js";
import { deleteUploadedImages } from "../utils/uploadedMedia.js";

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

function addQueryClause(query, clause) {
  query.$and = [...(query.$and || []), clause];
}

function publicListingClause() {
  return {
    $and: [
      { $or: [{ moderationStatus: "Approved" }, { moderationStatus: { $exists: false } }] },
      { $or: [{ accountHidden: false }, { accountHidden: { $exists: false } }] }
    ]
  };
}

function isSeller(req) {
  return req.user?.role === "Vendeur";
}

function sellerOwnsCar(req, car) {
  return isSeller(req) && String(car?.owner || "") === String(req.user.id);
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

function orderCarImages(existingImages, uploadedImages, rawOrder) {
  if (!rawOrder) return [...existingImages, ...uploadedImages];

  try {
    const order = typeof rawOrder === "string" ? JSON.parse(rawOrder) : rawOrder;
    if (!Array.isArray(order)) return [...existingImages, ...uploadedImages];

    const existingByUrl = new Map(existingImages.map((image) => [image.url, image]));
    const result = [];
    const usedExisting = new Set();
    const usedNew = new Set();

    order.forEach((item) => {
      if (item?.type === "existing") {
        const image = existingByUrl.get(String(item.url || ""));
        if (image && !usedExisting.has(image.url)) {
          result.push(image);
          usedExisting.add(image.url);
        }
      } else if (item?.type === "new") {
        const index = Number(item.index);
        const image = uploadedImages[index];
        if (image && !usedNew.has(index)) {
          result.push(image);
          usedNew.add(index);
        }
      }
    });

    existingImages.forEach((image) => {
      if (!usedExisting.has(image.url)) result.push(image);
    });
    uploadedImages.forEach((image, index) => {
      if (!usedNew.has(index)) result.push(image);
    });
    return result;
  } catch (_error) {
    return [...existingImages, ...uploadedImages];
  }
}

function serializePublicCar(car) {
  const payload = serializeCar(car);

  delete payload.owner;
  delete payload.sellerPrice;
  delete payload.serviceFee;
  delete payload.submittedByRole;
  delete payload.moderationStatus;
  delete payload.moderationNote;
  delete payload.approvedBy;
  delete payload.accountHidden;
  delete payload.lastSellerEditAt;

  return payload;
}

function normalizeCarPayload(body) {
  const normalized = { ...body };

  const year = toNumber(body.year);
  const mileage = toNumber(body.mileage);
  const price = toNumber(body.price);
  const engineCapacity = toNumber(body.engineCapacity);
  const numericFields = ["cylinders", "doors", "seats", "powerHp", "powerKw"];

  if (year !== undefined) normalized.year = year;
  if (mileage !== undefined) normalized.mileage = mileage;
  if (engineCapacity !== undefined) normalized.engineCapacity = engineCapacity;
  numericFields.forEach((field) => {
    const parsed = toNumber(body[field]);
    if (parsed !== undefined) normalized[field] = parsed;
    else if (body[field] === "") normalized[field] = null;
  });
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
  const safety = toStringList(body.safety);

  if (badges !== undefined) normalized.badges = badges;
  if (equipment !== undefined) normalized.equipment = equipment;
  if (safety !== undefined) normalized.safety = safety;

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
  delete normalized.imageOrder;
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
      exteriorColor: "اللون",
      engineCapacity: "سعة المحرك",
      regionalSpecs: "المواصفات الإقليمية"
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
      engineCapacity,
      minEngineCapacity,
      maxEngineCapacity,
      regionalSpecs,
      bodyType,
      trim,
      exteriorColor,
      interiorColor,
      cylinders,
      minPowerHp,
      maxPowerHp,
      steeringSide,
      doors,
      seats,
      wheelSize,
      location,
      exportStatus,
      serviceHistory,
      availability,
      safety,
      sort = "-createdAt"
    } = req.query;

    const query = {};
    addQueryClause(query, publicListingClause());

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { model: new RegExp(search, "i") },
        { trim: new RegExp(search, "i") },
        { bodyType: new RegExp(search, "i") },
        { fuelType: new RegExp(search, "i") },
        { exteriorColor: new RegExp(search, "i") },
        { interiorColor: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
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
    if (gearbox) query.gearbox = new RegExp(`^${escapeRegex(gearbox)}$`, "i");
    if (regionalSpecs) {
      const requestedSpecs = String(regionalSpecs).split(",");
      if (requestedSpecs.includes("Other")) {
        query.$and = [
          ...(query.$and || []),
          { $or: [{ regionalSpecs: { $in: requestedSpecs } }, { regionalSpecs: { $exists: false } }, { regionalSpecs: null }, { regionalSpecs: "" }] }
        ];
      } else {
        query.regionalSpecs = { $in: requestedSpecs };
      }
    }

    if (bodyType) query.bodyType = { $in: String(bodyType).split(",") };
    if (trim) query.trim = { $in: String(trim).split(",") };
    if (exteriorColor) query.exteriorColor = { $in: String(exteriorColor).split(",") };
    if (interiorColor) query.interiorColor = new RegExp(escapeRegex(interiorColor), "i");
    if (steeringSide) query.steeringSide = steeringSide;
    if (wheelSize) query.wheelSize = new RegExp(`^${escapeRegex(wheelSize)}$`, "i");
    if (location) query.location = new RegExp(escapeRegex(location), "i");
    if (exportStatus) query.exportStatus = exportStatus;
    if (serviceHistory) query.serviceHistory = serviceHistory;
    if (availability) query.status = normalizeStatusValue(availability);
    if (cylinders) query.cylinders = Number(cylinders);
    if (doors) query.doors = Number(doors);
    if (seats) query.seats = Number(seats);
    if (minPowerHp || maxPowerHp) {
      query.powerHp = {
        ...(minPowerHp ? { $gte: Number(minPowerHp) } : {}),
        ...(maxPowerHp ? { $lte: Number(maxPowerHp) } : {})
      };
    }
    if (safety) query.safety = { $all: String(safety).split(",").map((item) => new RegExp(`^${escapeRegex(item.trim())}$`, "i")) };
    if (engineCapacity) query.engineCapacity = Number(engineCapacity);
    if (minEngineCapacity || maxEngineCapacity) {
      query.engineCapacity = {
        ...(minEngineCapacity ? { $gte: Number(minEngineCapacity) } : {}),
        ...(maxEngineCapacity ? { $lte: Number(maxEngineCapacity) } : {})
      };
    }

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
      addQueryClause(query, { $or: [{ transmission: transmissionPattern }, { drivetrain: transmissionPattern }] });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Car.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Car.countDocuments(query)
    ]);

    res.json({
      items: items.map(serializePublicCar),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("getCars error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des vehicules" });
  }
}

export async function getCarFilterOptions(_req, res) {
  try {
    const items = await Car.find(publicListingClause())
      .select("name brand model bodyType trim fuelType gearbox transmission drivetrain exteriorColor interiorColor cylinders doors seats steeringSide wheelSize location exportStatus serviceHistory powerHp engineCapacity regionalSpecs status availability safety -_id")
      .sort({ brand: 1, model: 1 })
      .lean();

    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json({ items });
  } catch (error) {
    console.error("getCarFilterOptions error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des filtres" });
  }
}

export async function getCarBySlug(req, res) {
  try {
    const car = await Car.findOne({ slug: req.params.slug, ...publicListingClause() });

    if (!car) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }

    // Increment views without re-validating legacy records. Some demo cars were
    // created before all current required fields existed, and `save()` made
    // their public detail page fail even though the record could be displayed.
    if (req.query.trackView !== "false") {
      await Car.updateOne({ _id: car._id }, { $inc: { views: 1 } });
      car.views = (car.views || 0) + 1;
    }

    const similar = await Car.find({
      _id: { $ne: car._id },
      $or: [{ category: { $in: getCategoryAliases(car.category) } }, { brand: car.brand }],
      ...publicListingClause()
    }).limit(3);

    const inquiriesCount = await Inquiry.countDocuments({ car: car._id });

    res.json({ car: serializePublicCar(car), similar: similar.map(serializePublicCar), inquiriesCount });
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

    const isPublic = (!car.moderationStatus || car.moderationStatus === "Approved") && !car.accountHidden;
    const canManage = req.user?.role === "Admin" || sellerOwnsCar(req, car);
    if (!isPublic && !canManage) return res.status(404).json({ message: "Vehicule introuvable" });

    res.json(canManage ? serializeCar(car) : serializePublicCar(car));
  } catch (error) {
    console.error("getCarById error:", error);
    res.status(500).json({ message: "Erreur lors du chargement du vehicule" });
  }
}

export async function createCar(req, res) {
  let uploadedImages = [];
  let carPersisted = false;
  try {
    const body = normalizeCarPayload(req.body);
    const slug = await makeUniqueCarSlug(body.brand, body.model, body.year);
    uploadedImages = buildUploadedImages(
      getUploadedFiles(req),
      body.name || `${body.brand || "Vehicule"} ${body.model || ""}`.trim()
    );

    const sellerSubmission = isSeller(req);
    const sellerPrice = sellerSubmission ? toNumber(req.body?.price) : undefined;
    const serviceFee = sellerSubmission ? 17000 : 0;
    if (sellerSubmission) {
      body.sellerPrice = sellerPrice ?? null;
      body.serviceFee = serviceFee;
      body.price = sellerPrice === undefined || body.priceType === "Sur demande" ? null : sellerPrice + serviceFee;
    }

    const car = await Car.create({
      ...body,
      slug,
      images: uploadedImages.length ? uploadedImages : body.images || [],
      owner: sellerSubmission ? req.user.id : null,
      submittedByRole: sellerSubmission ? "Vendeur" : "Admin",
      moderationStatus: sellerSubmission ? "Pending" : "Approved",
      approvedAt: sellerSubmission ? null : new Date(),
      approvedBy: sellerSubmission ? null : req.user.id
    });
    carPersisted = true;

    if (sellerSubmission) {
      await Notification.create({
        audience: "Admin",
        type: "SellerCarSubmitted",
        title: "Nouvelle voiture a valider",
        message: `${req.user.name || req.user.email} a ajoute ${car.name}`,
        actor: req.user.id,
        car: car._id,
        metadata: { sellerPrice: car.sellerPrice, serviceFee: car.serviceFee, finalPrice: car.price }
      });
    }

    res.status(201).json(serializeCar(car));
  } catch (error) {
    console.error("createCar error:", error);
    if (!carPersisted) await deleteUploadedImages(uploadedImages);
    sendCarWriteError(res, error, "تعذر إضافة المركبة. حاول مرة أخرى.");
  }
}

export async function updateCar(req, res) {
  let uploadedImages = [];
  let carPersisted = false;
  try {
    const existingCar = await Car.findById(req.params.id);
    if (!existingCar) return res.status(404).json({ message: "Vehicule introuvable" });
    if (isSeller(req) && !sellerOwnsCar(req, existingCar)) {
      return res.status(403).json({ message: "Vous pouvez modifier uniquement vos voitures" });
    }

    const updateData = normalizeCarPayload(req.body);
    const existingImages = parseExistingImages(req.body?.existingImages);
    uploadedImages = buildUploadedImages(
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
      updateData.images = orderCarImages(existingImages || [], uploadedImages, req.body?.imageOrder);
    }

    if (isSeller(req)) {
      const sellerPrice = toNumber(req.body?.price);
      updateData.sellerPrice = sellerPrice ?? null;
      updateData.serviceFee = Number(existingCar.serviceFee ?? 17000);
      updateData.price = sellerPrice === undefined || updateData.priceType === "Sur demande" ? null : sellerPrice + updateData.serviceFee;
      updateData.lastSellerEditAt = new Date();
      delete updateData.owner;
      delete updateData.submittedByRole;
      delete updateData.moderationStatus;
      delete updateData.moderationNote;
      delete updateData.approvedAt;
      delete updateData.approvedBy;
      delete updateData.accountHidden;
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });

    if (!car) {
      await deleteUploadedImages(uploadedImages);
      return res.status(404).json({ message: "Vehicule introuvable" });
    }
    carPersisted = true;

    if (updateData.images) {
      const keptUrls = new Set(updateData.images.map((image) => image.url));
      await deleteUploadedImages((existingCar.images || []).filter((image) => !keptUrls.has(image.url)));
    }


    if (isSeller(req)) {
      await Notification.create({
        audience: "Admin",
        type: "SellerCarUpdated",
        title: "Voiture modifiee par un vendeur",
        message: `${req.user.name || req.user.email} a modifie ${car.name}`,
        actor: req.user.id,
        car: car._id,
        metadata: { sellerPrice: car.sellerPrice, serviceFee: car.serviceFee, finalPrice: car.price }
      });
    }

    res.json(serializeCar(car));
  } catch (error) {
    console.error("updateCar error:", error);
    if (!carPersisted) await deleteUploadedImages(uploadedImages);
    sendCarWriteError(res, error, "تعذر حفظ التعديلات. حاول مرة أخرى.");
  }
}

export async function deleteCar(req, res) {
  try {
    const existingCar = await Car.findById(req.params.id);
    if (!existingCar) return res.status(404).json({ message: "Vehicule introuvable" });
    if (isSeller(req) && !sellerOwnsCar(req, existingCar)) {
      return res.status(403).json({ message: "Vous pouvez supprimer uniquement vos voitures" });
    }
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Vehicule introuvable" });
    }

    await deleteUploadedImages(car.images || []);

    res.json({ message: "Vehicule supprime" });
  } catch (error) {
    console.error("deleteCar error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
}

export async function getFeaturedCars(req, res) {
  try {
    const cars = await Car.find({ featured: true, status: "Disponible", ...publicListingClause() }).limit(6);
    res.json(cars.map(serializePublicCar));
  } catch (error) {
    console.error("getFeaturedCars error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des vehicules en vedette" });
  }
}

export async function getManagedCars(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 100));
    const query = isSeller(req) ? { owner: req.user.id } : {};
    const [items, total] = await Promise.all([
      Car.find(query).populate("owner", "name showroomName email phone accountStatus").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Car.countDocuments(query)
    ]);
    res.json({ items: items.map(serializeCar), total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getManagedCars error:", error);
    res.status(500).json({ message: "Impossible de charger les voitures gerees" });
  }
}

export async function moderateCar(req, res) {
  const moderationStatus = String(req.body?.moderationStatus || "");
  if (!["Pending", "Approved", "Rejected", "Hidden"].includes(moderationStatus)) {
    return res.status(400).json({ message: "Statut de validation invalide" });
  }
  const update = {
    moderationStatus,
    moderationNote: String(req.body?.moderationNote || "").trim(),
    ...(moderationStatus === "Approved" ? { approvedAt: new Date(), approvedBy: req.user.id } : {})
  };
  const car = await Car.findByIdAndUpdate(req.params.id, update, { new: true }).populate("owner", "name showroomName email");
  if (!car) return res.status(404).json({ message: "Vehicule introuvable" });

  if (car.owner?._id && ["Approved", "Rejected"].includes(moderationStatus)) {
    const approved = moderationStatus === "Approved";
    await Notification.create({
      audience: "Vendeur",
      recipient: car.owner._id,
      type: "System",
      title: approved ? "Vehicle approved" : "Vehicle rejected",
      message: approved
        ? `${car.name} has been approved and published.`
        : `${car.name} was rejected.${update.moderationNote ? ` Reason: ${update.moderationNote}` : ""}`,
      actor: req.user.id,
      car: car._id,
      metadata: { moderationStatus, moderationNote: update.moderationNote }
    });
  }

  res.json({ item: serializeCar(car) });
}

export async function updateCarPricing(req, res) {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: "Vehicule introuvable" });
  const sellerPrice = toNumber(req.body?.sellerPrice);
  const serviceFee = toNumber(req.body?.serviceFee);
  if (sellerPrice === undefined || serviceFee === undefined || sellerPrice < 0 || serviceFee < 0) {
    return res.status(400).json({ message: "Prix vendeur et frais valides requis" });
  }
  car.sellerPrice = sellerPrice;
  car.serviceFee = serviceFee;
  car.price = car.priceType === "Sur demande" ? null : sellerPrice + serviceFee;
  await car.save();
  res.json({ item: serializeCar(car) });
}
