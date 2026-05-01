"use client";

import { useEffect, useState } from "react";
import { Loader2, MailCheck, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

type InquiryItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
  car?: {
    name?: string;
  } | null;
};

export default function RequestsPageClient() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/inquiries")
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message || "تعذر تحميل إشعارات العملاء.");
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteOne = async (id: string) => {
    const confirmed = window.confirm("هل تريد حذف هذا الإشعار؟");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await api.delete(`/inquiries/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "تعذر حذف الإشعار.");
    } finally {
      setDeletingId("");
    }
  };

  const deleteAll = async () => {
    if (items.length === 0) {
      return;
    }

    const confirmed = window.confirm("هل تريد حذف كل الإشعارات؟ لا يمكن التراجع عن هذه العملية.");

    if (!confirmed) {
      return;
    }

    setClearing(true);
    setError("");

    try {
      await api.delete("/inquiries");
      setItems([]);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "تعذر حذف كل الإشعارات.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">CRM</p>
            <h1 className="mt-2 text-3xl font-bold">الإشعارات والرسائل</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              كل الطلبات والاستفسارات القادمة من الموقع ومن صفحات المركبات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700">
              <MailCheck className="h-4 w-4 text-brand" />
              {items.length} إشعار
            </span>

            <button
              type="button"
              onClick={deleteAll}
              disabled={loading || clearing || items.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              حذف الكل
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="rounded-[28px] border bg-white p-6 shadow-premium">جارٍ التحميل...</div>
        ) : items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed bg-white p-10 text-center text-zinc-500 shadow-premium dark:bg-zinc-900">
            لا توجد رسائل في الوقت الحالي.
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item._id}
              className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {new Date(item.createdAt).toLocaleString("ar-TN")}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{item.name}</h2>
                  <p className="mt-1 break-words text-sm text-zinc-500 dark:text-zinc-400">
                    {[item.email, item.phone].filter(Boolean).join(" | ")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold dark:bg-white/5">
                    {item.car?.name || "طلب عام"}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteOne(item._id)}
                    disabled={deletingId === item._id || clearing}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    حذف
                  </button>
                </div>
              </div>

              <p className="mt-4 rounded-2xl bg-zinc-50 px-4 py-4 leading-7 text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
                {item.message || "لا توجد رسالة."}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
