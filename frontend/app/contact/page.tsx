"use client";

import { useState } from "react";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { COMPANY_WHATSAPP_DISPLAY, buildWhatsAppUrl } from "@/lib/company";

export default function ContactPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="container-premium section-spacing">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">اتصل بنا</p>
          <h1 className="mt-3 font-serif text-5xl font-bold">خلّينا نحكيو على مركبتك القادمة</h1>
          <p className="mt-4 text-zinc-500">
            فريقنا يرد بسرعة بخصوص البيع، المعاينة، التوثيق والشحن.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border bg-white p-5 shadow-premium dark:bg-zinc-900">
              <Truck className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-xl font-bold">البيع والتوفر</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                قل لنا نوع المركبة التي تبحث عنها وسنوجهك إلى الخيارات المناسبة.
              </p>
            </div>
            <div className="rounded-[28px] border bg-white p-5 shadow-premium dark:bg-zinc-900">
              <ShieldCheck className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-xl font-bold">شراء آمن</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                نوجّهك في الوثائق، الفاتورة والخطوات اللازمة قبل تأكيد الشراء.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(
                "مرحبًا، أريد التحدث مع فريق ALHADUNICARS."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[28px] bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              واتساب {COMPANY_WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <form
          className="rounded-3xl border bg-white p-8 shadow-premium dark:bg-zinc-900"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget as HTMLFormElement);

            try {
              await api.post("/inquiries", {
                name: form.get("name"),
                email: form.get("email"),
                phone: form.get("phone"),
                message: form.get("message")
              });
              setFeedback("تم إرسال الرسالة بنجاح، وسيقوم الفريق بمراجعتها من لوحة الإدارة.");
              (e.currentTarget as HTMLFormElement).reset();
            } catch (error: any) {
              if (!error?.response) {
                setFeedback(
                  "قد يكون تم استلام طلبك بالفعل. لا حاجة لإعادة الإرسال، ويمكنك متابعة التفاصيل عبر واتساب إذا لزم الأمر."
                );
                return;
              }

              setFeedback(
                error?.response?.data?.message ||
                  "تعذر الإرسال حاليًا. يمكنك استخدام واتساب في الأثناء."
              );
            }
          }}
        >
          <div className="grid gap-4">
            <input name="name" placeholder="الاسم" className="rounded-2xl border bg-transparent px-4 py-3" required />
            <input name="email" type="email" placeholder="البريد الإلكتروني" className="rounded-2xl border bg-transparent px-4 py-3" required />
            <input name="phone" placeholder="رقم الهاتف" className="rounded-2xl border bg-transparent px-4 py-3" required />
            <textarea name="message" placeholder="اكتب رسالتك" rows={5} className="rounded-2xl border bg-transparent px-4 py-3" required />
            <button className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white">إرسال</button>
            {feedback ? <p className="text-sm text-zinc-500">{feedback}</p> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
