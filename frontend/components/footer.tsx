import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  COMPANY_LOCATION,
  COMPANY_NAME,
  COMPANY_WHATSAPP_DISPLAY,
  NAV_LINKS,
  buildWhatsAppUrl
} from "@/lib/company";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/10 bg-zinc-950 text-white">
      <div className="container-premium grid gap-10 py-14 md:grid-cols-4">
        <div>
          <BrandLogo className="h-24 w-24" />
          <p className="mt-4 text-sm text-zinc-400">
            {COMPANY_NAME} يوفّر مرافقة واضحة في المعاينة، التوثيق، الشحن والمتابعة حتى الاستلام.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">التصفح</h4>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/faq">الأسئلة الشائعة</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">معلومات قانونية</h4>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            <Link href="/mentions-legales">البيانات القانونية</Link>
            <Link href="/confidentialite">سياسة الخصوصية</Link>
            <Link href="/cookies">ملفات الارتباط</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">التواصل</h4>
          <div className="mt-4 grid gap-3 text-sm text-zinc-300">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {COMPANY_LOCATION}
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              واتساب {COMPANY_WHATSAPP_DISPLAY}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              بيع، شحن ومتابعة إلى حين الاستلام
            </p>
            <a
              href={buildWhatsAppUrl(
                "مرحبًا، أريد الاستفسار عن المركبات المتوفرة لديكم."
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              تواصل مع فريقنا
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} {COMPANY_NAME} - جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
