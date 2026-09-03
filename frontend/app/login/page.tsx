"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { COMPANY_NAME } from "@/lib/company";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="container-premium section-spacing">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-[32px] border border-zinc-200/70 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-8 text-white shadow-premium dark:border-white/10">
          <BrandLogo className="h-28 w-28" priority />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            إدارة {COMPANY_NAME}
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
            دخول بسيط وآمن لإدارة المعرض.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            هذا الدخول مخصص للمسؤول فقط. بعد تسجيل الدخول يمكنك إدارة المركبات، متابعة رسائل العملاء والتحكم في الإعلانات من مساحة واحدة.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              تسجيل الدخول مربوط بالـ backend مع كلمة مرور مشفرة عبر bcrypt وJWT للطلبات الإدارية.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              أول حساب مسؤول يمكن إنشاؤه عبر seed أو عبر متغيرات البيئة الخاصة بالـ bootstrap.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              صفحات <code>/admin</code> محمية وتعيد التوجيه تلقائيًا إلى هذه الصفحة عند غياب الجلسة.
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-zinc-200/70 bg-white p-8 shadow-premium dark:border-white/10 dark:bg-zinc-900">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة إلى الموقع
          </Link>

          <p className="mt-6 gradient-text text-sm font-semibold uppercase tracking-[0.3em]">لوحة الإدارة</p>
          <h2 className="mt-3 text-3xl font-bold">تسجيل الدخول</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            أدخل بيانات حساب المسؤول المفعّل لهذا المشروع.
          </p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");

              try {
                const payload = {
                  email: state.email.trim().toLowerCase(),
                  password: state.password
                };
                const { data } = await api.post("/auth/admin/login", payload);
                setSession(data.accessToken, data.user, data.refreshToken);
                router.replace(redirectTo);
                router.refresh();
              } catch (err: any) {
                setError(
                  err?.response?.data?.message ||
                    "تعذر تسجيل الدخول. تحقق من الـ API وبيانات المسؤول."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            <label className="grid gap-2">
              <span className="text-sm font-medium">بريد المسؤول</span>
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand"
                placeholder="admin@your-company.com"
                autoComplete="username"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">كلمة المرور</span>
              <input
                type="password"
                value={state.password}
                onChange={(e) => setState({ ...state, password: e.target.value })}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand"
                placeholder="كلمة مرور المسؤول"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "جارٍ تسجيل الدخول..." : "الدخول إلى لوحة التحكم"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
