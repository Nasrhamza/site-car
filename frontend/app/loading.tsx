export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border px-5 py-3 shadow-premium">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-electric [animation-delay:120ms]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-gold [animation-delay:240ms]" />
        <span className="text-sm font-semibold">جارٍ تحميل التجربة...</span>
      </div>
    </div>
  );
}
