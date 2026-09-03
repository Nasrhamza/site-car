"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Store } from "lucide-react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/lib/site-language";

export default function SellerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const ar = language === "ar";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return <div className="container-premium section-spacing"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-premium dark:border-white/10 dark:bg-zinc-900 lg:grid-cols-2">
    <section className="bg-zinc-950 p-8 text-white sm:p-10"><BrandLogo className="h-24 w-24" /><div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"><Store className="h-4 w-4" />{ar ? "مساحة البائع" : "Seller space"}</div><h1 className="mt-6 text-4xl font-black">{ar ? "اعرض مركباتك مع ALHADUNICARS." : "Publish your vehicles with ALHADUNICARS."}</h1><p className="mt-4 leading-7 text-white/70">{ar ? "أدر إعلاناتك بنفسك. تراجع الإدارة كل مركبة جديدة قبل نشرها ويبقى تواصل المشترين مع ALHADUNICARS." : "Manage your own listings. Every new vehicle is reviewed before it appears publicly, and all buyer contact stays with ALHADUNICARS."}</p></section>
    <section className="p-8 sm:p-10"><h2 className="text-3xl font-black">{ar ? "دخول البائع" : "Seller login"}</h2><p className="mt-2 text-sm text-zinc-500">{ar ? "استعمل الحساب الذي فعلته الإدارة." : "Use the active account approved by the administrator."}</p>
      <form className="mt-7 grid gap-4" onSubmit={async (event) => { event.preventDefault(); setLoading(true); setError(""); try { const { data } = await api.post("/auth/seller/login", form); setSession(data.accessToken, data.user, data.refreshToken); router.replace(searchParams.get("redirect") || "/seller"); router.refresh(); } catch (requestError: any) { setError(requestError?.response?.data?.message || (ar ? "تعذر تسجيل الدخول" : "Unable to sign in")); } finally { setLoading(false); } }}>
        <label className="grid gap-2 text-sm font-bold">{ar ? "البريد الإلكتروني" : "Email"}<input type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value.trim().toLowerCase() }))} className="rounded-2xl border bg-transparent px-4 py-3 outline-none focus:border-brand" /></label>
        <label className="grid gap-2 text-sm font-bold">{ar ? "كلمة المرور" : "Password"}<input type="password" required value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="rounded-2xl border bg-transparent px-4 py-3 outline-none focus:border-brand" /></label>
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 font-black text-white disabled:opacity-60"><LogIn className="h-4 w-4" />{loading ? (ar ? "جار الدخول..." : "Signing in...") : (ar ? "فتح لوحة البائع" : "Open seller dashboard")}</button>
      </form>
      <p className="mt-6 text-sm text-zinc-500">{ar ? "ليس لديك حساب؟" : "No account yet?"} <Link href="/seller/request-account" className="font-black text-brand">{ar ? "اطلب حساب بائع" : "Request a seller account"}</Link></p>
    </section>
  </div></div>;
}
