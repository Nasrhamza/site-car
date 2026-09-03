"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LogIn, Send, Store } from "lucide-react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { useLanguage } from "@/lib/site-language";

export default function RequestSellerAccountPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const ar = language === "ar";
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [requestForm, setRequestForm] = useState({ name: "", showroomName: "", email: "", phone: "", address: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [sent, setSent] = useState(false);

  return <div className="container-premium section-spacing">
    <div className="mx-auto mb-8 max-w-4xl text-center"><p className="text-sm font-black uppercase tracking-[.25em] text-brand">{ar ? "شركاء ALHADUNICARS" : "ALHADUNICARS partners"}</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">{ar ? "اعرض مركباتك معنا" : "Sell your vehicles with us"}</h1><p className="mt-3 text-zinc-500">{ar ? "ادخل بحسابك أو أرسل طلباً جديداً ببيانات الاتصال." : "Sign in with your account or send a new request with your contact details."}</p></div>
    <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-2">
      <section className="rounded-[32px] bg-zinc-950 p-6 text-white shadow-2xl sm:p-9 lg:sticky lg:top-24">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-zinc-950"><LogIn className="h-5 w-5" /></span>
        <h2 className="mt-6 text-3xl font-black">{ar ? "لدي حساب بائع" : "I already have a seller account"}</h2>
        <p className="mt-3 leading-7 text-white/65">{ar ? "ادخل مباشرة إلى لوحة البائع لإدارة مركباتك." : "Sign in directly to your seller dashboard and manage your vehicles."}</p>
        <form className="mt-7 grid gap-4" onSubmit={async (event) => { event.preventDefault(); setLoginLoading(true); setLoginError(""); try { const { data } = await api.post("/auth/seller/login", loginForm); setSession(data.accessToken, data.user, data.refreshToken); router.replace("/seller"); router.refresh(); } catch (error: any) { setLoginError(error?.response?.data?.message || (ar ? "تعذر تسجيل الدخول" : "Unable to sign in")); } finally { setLoginLoading(false); } }}>
          <Field dark label={ar ? "البريد الإلكتروني" : "Email"} type="email" required value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value.trim().toLowerCase() }))} />
          <Field dark label={ar ? "كلمة المرور" : "Password"} type="password" required value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} />
          {loginError ? <p className="rounded-2xl bg-red-500/15 p-3 text-sm text-red-200">{loginError}</p> : null}
          <button disabled={loginLoading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-zinc-950 disabled:opacity-60"><LogIn className="h-4 w-4" />{loginLoading ? (ar ? "جار الدخول..." : "Signing in...") : (ar ? "الدخول إلى لوحة البائع" : "Open seller dashboard")}</button>
        </form>
      </section>

      <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-9">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white"><Store className="h-5 w-5" /></span>
        <h2 className="mt-6 text-3xl font-black">{ar ? "طلب حساب بائع جديد" : "Request a new seller account"}</h2>
        <p className="mt-3 leading-7 text-zinc-500">{ar ? "أرسل بيانات الاتصال. تراجع الإدارة الطلب وتتواصل معك قبل التفعيل." : "Send your contact details. The administrator reviews the request and contacts you before activation."}</p>
        {sent ? <div className="mt-7 rounded-3xl bg-emerald-50 p-6 text-emerald-800"><CheckCircle2 className="h-8 w-8" /><h3 className="mt-3 text-xl font-black">{ar ? "تم إرسال الطلب" : "Request sent"}</h3><p className="mt-2 text-sm">{ar ? "وصل طلبك إلى الإدارة وسيتم التواصل معك." : "The administrator received your request and will contact you."}</p></div> : <form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={async (event) => { event.preventDefault(); setRequestLoading(true); setRequestError(""); try { await api.post("/auth/seller/request", { ...requestForm, email: requestForm.email.trim().toLowerCase() }); setSent(true); } catch (error: any) { setRequestError(error?.response?.data?.message || (ar ? "تعذر إرسال الطلب" : "Unable to send request")); } finally { setRequestLoading(false); } }}>
          <Field label={ar ? "اسم جهة الاتصال" : "Contact name"} required value={requestForm.name} onChange={(event) => setRequestForm((current) => ({ ...current, name: event.target.value }))} />
          <Field label={ar ? "اسم المعرض / البائع" : "Showroom / seller name"} required value={requestForm.showroomName} onChange={(event) => setRequestForm((current) => ({ ...current, showroomName: event.target.value }))} />
          <Field label={ar ? "البريد الإلكتروني" : "Email"} type="email" required value={requestForm.email} onChange={(event) => setRequestForm((current) => ({ ...current, email: event.target.value }))} />
          <Field label={ar ? "الهاتف / واتساب" : "Phone / WhatsApp"} inputMode="tel" required placeholder="+971 50 000 0000" value={requestForm.phone} onChange={(event) => setRequestForm((current) => ({ ...current, phone: event.target.value }))} />
          <div className="sm:col-span-2"><Field label={ar ? "العنوان (اختياري)" : "Address (optional)"} value={requestForm.address} onChange={(event) => setRequestForm((current) => ({ ...current, address: event.target.value }))} /></div>
          <div className="sm:col-span-2"><Field label={ar ? "كلمة المرور (8 أحرف على الأقل)" : "Password (8 characters minimum)"} type="password" required minLength={8} value={requestForm.password} onChange={(event) => setRequestForm((current) => ({ ...current, password: event.target.value }))} /></div>
          {requestError ? <p className="sm:col-span-2 rounded-2xl bg-red-50 p-3 text-sm text-red-600">{requestError}</p> : null}
          <button disabled={requestLoading} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 font-black text-white disabled:opacity-60"><Send className="h-4 w-4" />{requestLoading ? (ar ? "جار الإرسال..." : "Sending...") : (ar ? "إرسال طلب الحساب" : "Send account request")}</button>
        </form>}
      </section>
    </div>
  </div>;
}

function Field({ label, dark = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; dark?: boolean }) {
  return <label className={`grid gap-2 text-sm font-bold ${dark ? "text-white" : ""}`}>{label}<input {...props} className={`rounded-2xl border px-4 py-3 outline-none transition focus:border-brand ${dark ? "border-white/15 bg-white/10 text-white" : "bg-transparent"}`} /></label>;
}
