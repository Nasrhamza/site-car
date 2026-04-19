import { CategoryFront } from "@/types";
import { VEHICLE_CATEGORIES } from "@/lib/company";

export const categories: CategoryFront[] = [
  ...VEHICLE_CATEGORIES.map((name) => ({ name, icon: "Truck" }))
];

export const faqs = [
  {
    q: "Puis-je reserver un vehicule a distance ?",
    a: "Oui, nous pouvons confirmer la disponibilite, partager les documents et organiser la reservation a distance."
  },
  {
    q: "Accompagnez-vous l'importation ?",
    a: "Oui, nous vous guidons sur la preparation export, les documents, l'expedition et le suivi jusqu'a la livraison."
  },
  {
    q: "Les vehicules sont-ils controles ?",
    a: "Oui, chaque annonce est verifiee avec une attention particuliere sur l'etat general, la documentation et la coherence du dossier."
  }
];
