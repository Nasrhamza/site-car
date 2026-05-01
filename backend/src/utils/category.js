const DEFAULT_CATEGORY = "Véhicules légers";

const CATEGORY_ALIASES = {
  Tracteurs: [
    "Tracteurs",
    "Tracteur",
    "Tracteur routier",
    "Tracteurs routiers"
  ],
  "Semi-remorques": [
    "Semi-remorques",
    "Semi-remorque",
    "Semi remorques",
    "Semi remorque",
    "Remorques",
    "Remorque"
  ],
  Camions: [
    "Camions",
    "Camion",
    "Pick-up & Camions legers",
    "Pick-up & Camions légers",
    "Pick-up",
    "Pickups",
    "Poids lourds"
  ],
  Utilitaires: [
    "Utilitaires",
    "Utilitaire",
    "Utilitaires & Fourgons",
    "Utilitaires & fourgons",
    "Fourgons",
    "Fourgon"
  ],
  "Engins TP": [
    "Engins TP",
    "Engin TP",
    "Engins de chantier",
    "TP",
    "BTP"
  ],
  "Bus / Minibus": [
    "Bus / Minibus",
    "Bus",
    "Minibus",
    "Autocar",
    "Autocars"
  ],
  "Véhicules légers": [
    "Véhicules légers",
    "Vehicules legers",
    "Vehicule leger",
    "Véhicule léger",
    "Voitures",
    "Voiture",
    "SUV",
    "Su",
    "su",
    "Voitures recentes (moins de 2 ans)",
    "Voitures récentes (moins de 2 ans)",
    "Electriques & Hybrides",
    "Électriques & Hybrides",
    "Coupes & Cabriolets",
    "Coupés & Cabriolets"
  ]
};

function normalizeCategoryKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const CATEGORY_LOOKUP = new Map();

Object.entries(CATEGORY_ALIASES).forEach(([category, aliases]) => {
  CATEGORY_LOOKUP.set(normalizeCategoryKey(category), category);

  aliases.forEach((alias) => {
    CATEGORY_LOOKUP.set(normalizeCategoryKey(alias), category);
  });
});

export function normalizeCategoryValue(value) {
  const key = normalizeCategoryKey(value);

  if (!key) {
    return DEFAULT_CATEGORY;
  }

  return CATEGORY_LOOKUP.get(key) || DEFAULT_CATEGORY;
}

export function getCategoryAliases(category) {
  const normalizedCategory = normalizeCategoryValue(category);

  return Array.from(
    new Set([normalizedCategory, ...(CATEGORY_ALIASES[normalizedCategory] || [])])
  );
}
