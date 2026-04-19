import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  COMPANY_LOCATION,
  COMPANY_NAME,
  COMPANY_SUBTITLE,
  COMPANY_WHATSAPP_DISPLAY,
  NAV_LINKS,
  buildWhatsAppUrl
} from "@/lib/company";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/10 bg-zinc-950 text-white">
      <div className="container-premium grid gap-10 py-14 md:grid-cols-4">
        <div>
          <BrandLogo className="h-[68px] w-[220px]" />
          <p className="mt-4 text-sm text-zinc-400">
            {COMPANY_NAME} propose une selection de {COMPANY_SUBTITLE.toLowerCase()} avec accompagnement commercial,
            verification documentaire et support a l&apos;importation.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Navigation</h4>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/faq">FAQ</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Legal</h4>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            <Link href="/mentions-legales">Mentions legales</Link>
            <Link href="/confidentialite">Confidentialite</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <div className="mt-4 grid gap-3 text-sm text-zinc-300">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {COMPANY_LOCATION}
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp {COMPANY_WHATSAPP_DISPLAY}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Vente, importation et suivi export
            </p>
            <a
              href={buildWhatsAppUrl(
                "Bonjour, je souhaite obtenir des informations sur vos vehicules disponibles."
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Contacter notre equipe
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} {COMPANY_NAME} - Tous droits reserves.
      </div>
    </footer>
  );
}
