"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Share, Smartphone, X } from "lucide-react";
import { useLanguage } from "@/lib/site-language";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function AppInstallButton() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [mounted, setMounted] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installing, setInstalling] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setMounted(true);
    const standalone = window.matchMedia("(display-mode: standalone)");
    const syncDisplayMode = () => setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
      setOpen(false);
    };
    syncDisplayMode();
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    standalone.addEventListener("change", syncDisplayMode);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch((error) => {
        console.warn("App service worker registration failed:", error);
      });
    }
    return () => {
      standalone.removeEventListener("change", syncDisplayMode);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) element.showModal();
    if (!open && element?.open) element.close();
  }, [open]);

  async function install() {
    if (!prompt || installing) return;
    setInstalling(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setPrompt(null);
      if (choice.outcome === "accepted") setOpen(false);
    } catch {
      setPrompt(null);
    } finally {
      setInstalling(false);
    }
  }

  if (installed) return null;

  const steps = ios
    ? [
      ar ? "افتح الموقع في Safari ثم اضغط على زر المشاركة." : "Open this website in Safari, then tap Share.",
      ar ? "اختر «إضافة إلى الشاشة الرئيسية». إذا ظهر خيار «فتح كتطبيق ويب»، اتركه مفعّلاً." : "Choose Add to Home Screen. If Open as Web App appears, leave it enabled.",
      ar ? "اضغط «إضافة»، ثم افتح ALHADUNICARS من أيقونته على الشاشة الرئيسية." : "Tap Add, then launch ALHADUNICARS from its home-screen icon."
    ]
    : [
      ar ? "افتح قائمة المتصفح في Chrome أو Edge." : "Open the browser menu in Chrome or Edge.",
      ar ? "اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»، ثم أكّد التثبيت." : "Choose Install app or Add to Home Screen, then confirm installation.",
      ar ? "افتح ALHADUNICARS من أيقونته على الشاشة الرئيسية." : "Launch ALHADUNICARS from its home-screen icon."
    ];

  return <>
    <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={ar ? "تثبيت التطبيق" : "Install app"} title={ar ? "تثبيت التطبيق" : "Install app"} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand/20 bg-brand/5 text-brand transition hover:bg-brand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
      <Download aria-hidden="true" className="h-5 w-5" />
    </button>
    {mounted && createPortal(
      <dialog ref={dialog} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }} aria-labelledby="install-app-title" aria-describedby="install-app-description" dir={ar ? "rtl" : "ltr"} className="app-install-dialog w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-zinc-200 bg-white p-6 text-zinc-900 shadow-2xl dark:border-white/10 dark:bg-zinc-900 dark:text-white">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex rounded-2xl bg-brand/10 p-3 text-brand"><Smartphone aria-hidden="true" className="h-7 w-7" /></span>
          <button type="button" onClick={() => setOpen(false)} aria-label={ar ? "إغلاق" : "Close"} className="grid h-11 w-11 place-items-center rounded-full bg-zinc-100 dark:bg-white/10"><X aria-hidden="true" className="h-5 w-5" /></button>
        </div>
        <h2 id="install-app-title" className="mt-5 text-2xl font-black">{ar ? "ALHADUNICARS كتطبيق" : "ALHADUNICARS as an app"}</h2>
        <p id="install-app-description" className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{ar ? "ثبّت الموقع على الشاشة الرئيسية، ثم افتحه من الأيقونة لتجربة مستقلة بدون شريط عنوان المتصفح في الأجهزة الداعمة." : "Add the website to your home screen, then open its icon for a standalone experience without the browser address bar on supported devices."}</p>
        {prompt ? <button type="button" disabled={installing} onClick={install} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"><Download aria-hidden="true" className="h-5 w-5" />{installing ? (ar ? "جار فتح التثبيت..." : "Opening installation...") : (ar ? "تثبيت التطبيق" : "Install app")}</button> : <ol className="mt-6 grid gap-4">
          {steps.map((step, index) => <li key={step} className="flex items-start gap-3 text-sm leading-6"><span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-black text-brand">{index + 1}</span><span>{step}{ios && index === 0 ? <Share aria-hidden="true" className="ms-2 inline h-4 w-4" /> : null}</span></li>)}
        </ol>}
        <p className="mt-6 rounded-xl bg-zinc-100 p-3 text-xs leading-6 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">{ar ? "فتح الرابط العادي يبقى داخل المتصفح. عرض السيارات والحسابات يحتاج اتصالاً بالإنترنت." : "A normal website link still opens in your browser. Vehicles and account features require an internet connection."}</p>
      </dialog>, document.body
    )}
  </>;
}
