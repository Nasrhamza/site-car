"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, LayoutDashboard, MonitorSmartphone, Phone } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import {
  COMPANY_NAME,
  DEVELOPER_NAME,
  DEVELOPER_NAME_AR,
  DEVELOPER_FACEBOOK_URL,
  DEVELOPER_WHATSAPP_DISPLAY,
  DEVELOPER_WHATSAPP_PHONE
} from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function DeveloperProfile() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const whatsappUrl = `https://wa.me/${DEVELOPER_WHATSAPP_PHONE}?text=${encodeURIComponent(
    ar ? "مرحباً حمزة، أريد التواصل معك بخصوص تطوير موقع ويب." : "Hello Hamza, I would like to discuss a website project."
  )}`;
  const features = [
    { icon: MonitorSmartphone, title: ar ? "واجهات متجاوبة" : "Responsive interfaces", text: ar ? "تجربة واضحة ومنظمة على الهاتف والحاسوب." : "Clear, organized experiences on mobile and desktop." },
    { icon: LayoutDashboard, title: ar ? "لوحات إدارة" : "Management dashboards", text: ar ? "واجهات لإدارة السيارات والحسابات والمحتوى." : "Interfaces for managing vehicles, accounts and content." },
    { icon: Code2, title: ar ? "تطوير الموقع" : "Website development", text: ar ? "تصميم وتطوير موقع ALHADUNICARS وتحسين تجربته." : "Design and development of the ALHADUNICARS website and its experience." }
  ];

  return (
    <div className="container-premium section-spacing" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[32px] bg-zinc-950 p-6 text-white sm:p-10 lg:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-brand-gold"><Code2 aria-hidden="true" className="h-4 w-4" />{ar ? "المطور وراء الموقع" : "The developer behind the website"}</p>
              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">{ar ? DEVELOPER_NAME_AR : DEVELOPER_NAME}</h1>
              <p className="mt-3 text-xl font-semibold text-white/80">{ar ? "مصمم ومطور مواقع ويب" : "Web designer & developer"}</p>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/65">{ar ? `أنا حمزة نصر، مطور موقع ${COMPANY_NAME}. أهتم بتصميم واجهات مرتبة وسهلة الاستعمال تجمع بين المظهر الجميل والوظائف العملية.` : `I'm Hamza Nasr, the developer of ${COMPANY_NAME}. I focus on clean, easy-to-use interfaces that bring thoughtful design and practical functionality together.`}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-brand px-6 py-4 font-bold transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><FaWhatsapp aria-hidden="true" className="h-5 w-5" />{ar ? "تواصل معي" : "Let's talk"}<ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" /></a>
            </div>
            <div aria-hidden="true" className="hidden h-52 w-52 items-center justify-center rounded-[40px] border border-white/15 bg-white/5 lg:flex">
              <div className="text-center"><span className="text-7xl font-black text-white" dir="ltr">HN<span className="text-brand">.</span></span><Code2 className="mx-auto mt-5 h-8 w-8 text-brand-gold" /></div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-brand/15 bg-brand/5 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">{ar ? "من صمم وطور موقع ALHADUNICARS؟" : "Who designed and developed ALHADUNICARS?"}</h2>
          <p className="mt-3 text-sm leading-8 text-zinc-700 dark:text-zinc-300">{ar ? "صمم وطور هذا الموقع حمزة نصر (Hamza Nasr). يمكنك التواصل معه على الرقم " : "This website was designed and developed by Hamza Nasr (حمزة نصر). You can reach him at "}<a href={`tel:+${DEVELOPER_WHATSAPP_PHONE}`} dir="ltr" className="inline-block font-bold text-brand hover:underline">{DEVELOPER_WHATSAPP_DISPLAY}</a>{ar ? "، أو عبر واتساب وفيسبوك باستخدام الروابط أدناه." : ", or via WhatsApp and Facebook using the links below."}</p>
        </section>

        <section aria-labelledby="developer-work" className="mt-10">
          <h2 id="developer-work" className="text-2xl font-extrabold">{ar ? "تصميم عملي، تجربة مريحة" : "Thoughtful design. A comfortable experience."}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
                <span className="inline-flex rounded-2xl bg-brand/10 p-3 text-brand"><Icon aria-hidden="true" className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="developer-contact" className="mt-10 rounded-[28px] border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900 sm:p-8">
          <h2 id="developer-contact" className="text-2xl font-extrabold">{ar ? "لنتواصل مباشرة" : "Get in touch directly"}</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{ar ? "عندك فكرة موقع أو تحتاج مساعدة تقنية؟ اختر الطريقة المناسبة للتواصل معي." : "Have a website idea or need technical support? Choose the easiest way to reach me."}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a href={`tel:+${DEVELOPER_WHATSAPP_PHONE}`} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-brand dark:border-white/15 dark:hover:border-brand"><Phone aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" /><span><span className="block text-xs text-zinc-500 dark:text-zinc-400">{ar ? "الهاتف" : "Phone"}</span><span className="mt-1 block text-sm font-bold" dir="ltr">{DEVELOPER_WHATSAPP_DISPLAY}</span></span></a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"><FaWhatsapp aria-hidden="true" className="h-6 w-6 shrink-0" /><span className="text-sm font-bold">{ar ? "واتساب" : "WhatsApp"}</span><ArrowUpRight aria-hidden="true" className="ms-auto h-4 w-4 shrink-0 rtl:-scale-x-100" /></a>
            <a href={DEVELOPER_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"><FaFacebookF aria-hidden="true" className="h-5 w-5 shrink-0" /><span className="text-sm font-bold">{ar ? "فيسبوك" : "Facebook"}</span><ArrowUpRight aria-hidden="true" className="ms-auto h-4 w-4 shrink-0 rtl:-scale-x-100" /></a>
          </div>
          <p className="mt-6 border-t border-zinc-200 pt-5 text-sm leading-7 text-zinc-500 dark:border-white/10 dark:text-zinc-400">{ar ? "للاستفسار عن السيارات أو الشحن، تواصل مع " : "For vehicle or shipping enquiries, contact "}<Link href="/contact" className="font-semibold text-brand hover:underline">{ar ? "فريق ALHADUNICARS" : "the ALHADUNICARS team"}</Link>.</p>
        </section>
      </div>
    </div>
  );
}
