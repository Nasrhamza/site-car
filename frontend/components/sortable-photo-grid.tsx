"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, GripVertical, Image as ImageIcon, Star, Trash2 } from "lucide-react";

export type SortablePhotoItem = {
  id: string;
  label: string;
  src?: string;
  file?: File;
};

function PhotoPreview({ item }: { item: SortablePhotoItem }) {
  const [preview, setPreview] = useState(item.src || "");

  useEffect(() => {
    if (!item.file) {
      setPreview(item.src || "");
      return;
    }

    const objectUrl = URL.createObjectURL(item.file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.file, item.src]);

  return preview
    ? <img src={preview} alt={item.label} className="h-full w-full object-cover" />
    : <ImageIcon className="h-8 w-8 text-zinc-300" />;
}

export function SortablePhotoGrid({
  items,
  onReorder,
  onRemove,
  language = "en"
}: {
  items: SortablePhotoItem[];
  onReorder: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  language?: "en" | "ar";
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const ar = language === "ar";

  if (!items.length) return null;

  return <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item, index) => <article
      key={item.id}
      draggable
      onDragStart={(event) => {
        setDraggedIndex(index);
        event.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => setDraggedIndex(null)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) onReorder(draggedIndex, index);
        setDraggedIndex(null);
      }}
      className={`overflow-hidden rounded-2xl border bg-white p-2 transition dark:bg-zinc-900 ${draggedIndex === index ? "border-brand opacity-60" : "border-zinc-200 dark:border-white/10"}`}
    >
      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
        <PhotoPreview item={item} />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-[10px] font-black text-white">
          {index === 0 ? <><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{ar ? "صورة الغلاف" : "Cover"}</> : `#${index + 1}`}
        </span>
        <span className="absolute right-2 top-2 grid h-8 w-8 cursor-grab place-items-center rounded-full bg-white/90 text-zinc-700 shadow-sm active:cursor-grabbing"><GripVertical className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 truncate px-1 text-xs font-bold" title={item.label}>{item.label}</p>
      <div className="mt-2 grid grid-cols-[auto_auto_1fr_auto] gap-1">
        <button type="button" disabled={index === 0} onClick={() => onReorder(index, index - 1)} aria-label={ar ? "حرّك لليسار" : "Move left"} className="grid h-9 w-9 place-items-center rounded-lg border disabled:opacity-30 dark:border-white/10"><ArrowLeft className="h-4 w-4 rtl:rotate-180" /></button>
        <button type="button" disabled={index === items.length - 1} onClick={() => onReorder(index, index + 1)} aria-label={ar ? "حرّك لليمين" : "Move right"} className="grid h-9 w-9 place-items-center rounded-lg border disabled:opacity-30 dark:border-white/10"><ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
        {index > 0 ? <button type="button" onClick={() => onReorder(index, 0)} className="rounded-lg border px-2 text-[11px] font-black text-amber-700 dark:border-white/10 dark:text-amber-300">{ar ? "اجعلها الغلاف" : "Make cover"}</button> : <span />}
        <button type="button" onClick={() => onRemove(index)} aria-label={ar ? "حذف الصورة" : "Remove photo"} className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
      </div>
    </article>)}
  </div>;
}

export function reorderItems<T>(items: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
