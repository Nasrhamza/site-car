import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";

export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(
    "Bonjour, je souhaite des renseignements sur vos vehicules disponibles."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-50 flex min-h-14 min-w-14 items-center justify-center rounded-full bg-green-500 px-4 text-white shadow-premium transition hover:scale-110 sm:bottom-5 sm:right-5"
      aria-label="WhatsApp"
    >
      <span className="hidden pr-2 text-sm font-semibold sm:inline">WhatsApp</span>
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
