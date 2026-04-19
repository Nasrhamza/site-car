export const COMPANY_NAME = "ALHADUNI CARS";
export const COMPANY_SHORT_NAME = "HADUNI CARS";
export const COMPANY_SECONDARY_NAME = "HADUNI";
export const COMPANY_SUBTITLE = "TRUCKS & VEHICLES";
export const COMPANY_DESCRIPTION =
  "Plateforme professionnelle de vente et d'importation de camions, tracteurs routiers, semi-remorques et vehicules utilitaires.";
export const COMPANY_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "971563543177";
export const COMPANY_WHATSAPP_DISPLAY = "+971 56 354 3177";
export const COMPANY_LOCATION = "Emirats arabes unis";

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/guide", label: "Guide" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" }
];

export const VEHICLE_CATEGORIES = [
  "Tracteurs",
  "Semi-remorques",
  "Camions",
  "Utilitaires",
  "Engins TP",
  "Bus / Minibus",
  "Véhicules légers"
] as const;

export const DEFAULT_VEHICLE_CATEGORY = "Utilitaires";
export const FUEL_TYPE_OPTIONS = [
  "Diesel",
  "Essence",
  "Hybride",
  "Électrique",
  "GPL",
  "Autre"
] as const;
export const DEFAULT_FUEL_TYPE = "Autre";
export const PRODUCT_STATUS_OPTIONS = ["Disponible", "Reserve", "Vendu", "Masque"] as const;

export const CATEGORY_SLUGS: Record<string, (typeof VEHICLE_CATEGORIES)[number]> = {
  tracteurs: "Tracteurs",
  "semi-remorques": "Semi-remorques",
  camions: "Camions",
  utilitaires: "Utilitaires",
  "engins-tp": "Engins TP",
  "bus-minibus": "Bus / Minibus",
  "vehicules-legers": "Véhicules légers"
};

const CATEGORY_TO_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([slug, category]) => [category, slug])
) as Record<string, string>;

export function getCategorySlug(category: string) {
  return (
    CATEGORY_TO_SLUG[category] ||
    category
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export const GUIDE_PAGES = [
  {
    slug: "achat-securise",
    title: "Guide d'achat securise",
    eyebrow: "Guide professionnel",
    description:
      "Une methode simple pour verifier le vehicule, les documents et le paiement avant validation.",
    image: "/guide-secure.svg",
    heroLabel: "Inspection, documents et paiement",
    ctaMessage:
      "Bonjour, je souhaite etre accompagne pour un achat securise de vehicule.",
    steps: [
      {
        icon: "ClipboardCheck",
        title: "Definir le besoin",
        description:
          "Identifiez le type de vehicule, l'usage, le budget et les contraintes d'exploitation avant toute reservation."
      },
      {
        icon: "Truck",
        title: "Inspecter le vehicule",
        description:
          "Controle visuel, kilometrage, chassis, cabine, pneumatiques, historique d'entretien et coherence generale."
      },
      {
        icon: "FileText",
        title: "Verifier les documents",
        description:
          "Carte grise, certificat de cession, facture, carnet d'entretien, numero de chassis et documents d'origine."
      },
      {
        icon: "BadgeCheck",
        title: "Valider la facture officielle",
        description:
          "Chaque vente doit etre formalisee par une facture claire avec les references du vehicule et les conditions de livraison."
      },
      {
        icon: "ShieldCheck",
        title: "Securiser le paiement",
        description:
          "Utilisez une methode tracable, verifiez l'identite du vendeur et ne payez jamais sans preuve documentaire."
      },
      {
        icon: "MessageCircle",
        title: "Organiser la remise",
        description:
          "Planifiez le retrait ou la livraison avec un recapitulatif ecrit, les contacts utiles et le suivi apres vente."
      }
    ]
  },
  {
    slug: "importation",
    title: "Guide importation",
    eyebrow: "Export & logistique",
    description:
      "Les six etapes pour preparer l'export, l'expedition et le suivi d'un vehicule jusqu'a la livraison finale.",
    image: "/guide-import.svg",
    heroLabel: "Export, documents et suivi",
    ctaMessage:
      "Bonjour, je souhaite en savoir plus sur l'importation d'un vehicule.",
    steps: [
      {
        icon: "SearchCheck",
        title: "Selection du vehicule",
        description:
          "Choisissez le modele adapte au marche de destination, aux normes locales et au budget logistique."
      },
      {
        icon: "PackageCheck",
        title: "Preparation export",
        description:
          "Controle technique, nettoyage, prise de photos, fiche de conformite et validation du bon de commande export."
      },
      {
        icon: "Files",
        title: "Constituer les documents",
        description:
          "Facture commerciale, certificat d'origine, documents douaniers, immatriculation et pieces d'identification."
      },
      {
        icon: "ShipWheel",
        title: "Expedition",
        description:
          "Reservation maritime ou terrestre, chargement securise, assurance transport et calendrier d'embarquement."
      },
      {
        icon: "MapPinned",
        title: "Suivi de transit",
        description:
          "Partage des etapes de transport, suivi des documents et coordination avec le transitaire jusqu'a l'arrivee."
      },
      {
        icon: "Handshake",
        title: "Livraison finale",
        description:
          "Dedouanement, remise des documents finaux, controle de reception et accompagnement jusqu'a la mise en service."
      }
    ]
  }
] as const;

export type GuidePage = (typeof GUIDE_PAGES)[number];

export function getGuideBySlug(slug: string) {
  return GUIDE_PAGES.find((guide) => guide.slug === slug);
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${COMPANY_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://example.com";
}
