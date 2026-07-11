const DEFAULT_FUEL_TYPE = "Autre";

const FUEL_TYPE_ALIASES = {
  Diesel: ["Diesel", "diesel"],
  Essence: ["Essence", "essence", "Petrol", "petrol"],
  Hybride: ["Hybride", "hybride", "Hybrid", "hybrid"],
  PHEV: ["PHEV", "phev", "Plug-in Hybrid", "Plug in Hybrid", "Plug-in Hybrid Electric Vehicle"],
  "Électrique": ["Électrique", "Electrique", "électrique", "electrique", "EV", "ev"],
  GPL: ["GPL", "gpl", "Gaz", "gaz"],
  Autre: ["Autre", "autre", "Other", "other", ""]
};

const ALLOWED_FUEL_TYPES = Object.keys(FUEL_TYPE_ALIASES);

function normalizeFuelKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const FUEL_LOOKUP = new Map();

Object.entries(FUEL_TYPE_ALIASES).forEach(([fuelType, aliases]) => {
  FUEL_LOOKUP.set(normalizeFuelKey(fuelType), fuelType);

  aliases.forEach((alias) => {
    FUEL_LOOKUP.set(normalizeFuelKey(alias), fuelType);
  });
});

export function normalizeFuelTypeValue(value) {
  const key = normalizeFuelKey(value);

  if (!key) {
    return DEFAULT_FUEL_TYPE;
  }

  return FUEL_LOOKUP.get(key) || DEFAULT_FUEL_TYPE;
}

export function getFuelTypeAliases(fuelType) {
  const normalizedFuelType = normalizeFuelTypeValue(fuelType);

  return Array.from(
    new Set([normalizedFuelType, ...(FUEL_TYPE_ALIASES[normalizedFuelType] || [])])
  );
}

export function isAllowedFuelTypeValue(value) {
  const key = normalizeFuelKey(value);
  return !key || FUEL_LOOKUP.has(key);
}

export function isOtherFuelType(value) {
  return normalizeFuelTypeValue(value) === DEFAULT_FUEL_TYPE;
}

export { ALLOWED_FUEL_TYPES, DEFAULT_FUEL_TYPE };
