"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/site-language";

export default function SellerSettingsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return <section className="max-w-2xl rounded-[28px] border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"><h1 className="text-3xl font-black">{ar ? "تغيير كلمة المرور" : "Change password"}</h1><form className="mt-6 grid gap-4" onSubmit={async (event) => { event.preventDefault(); setMessage(""); setError(""); if (form.newPassword !== form.confirmPassword) return setError(ar ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"); try { const { data } = await api.put("/auth/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword }); setMessage(data.message); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); } catch (requestError: any) { setError(requestError?.response?.data?.message || (ar ? "تعذر تحديث كلمة المرور" : "Unable to update password")); } }}>
    {[{ key: "currentPassword", label: ar ? "كلمة المرور الحالية" : "Current password" }, { key: "newPassword", label: ar ? "كلمة المرور الجديدة" : "New password" }, { key: "confirmPassword", label: ar ? "تأكيد كلمة المرور" : "Confirm password" }].map(({ key, label }) => <label key={key} className="grid gap-2 text-sm font-bold">{label}<input type="password" required minLength={key === "currentPassword" ? undefined : 8} value={(form as any)[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="rounded-2xl border bg-transparent px-4 py-3 outline-none focus:border-brand" /></label>)}
    {message ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div> : null}{error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}<button className="rounded-2xl bg-brand px-5 py-4 font-black text-white">{ar ? "تحديث كلمة المرور" : "Update password"}</button>
  </form></section>;
}
