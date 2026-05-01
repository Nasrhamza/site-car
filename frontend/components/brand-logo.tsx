import Image from "next/image";
import { cn } from "@/lib/utils";
import { COMPANY_NAME, COMPANY_SUBTITLE } from "@/lib/company";

export function BrandLogo({
  className,
  priority = false,
  compact = false
}: {
  className?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const containerClassName = compact
    ? "relative inline-flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-950 p-0.5 shadow-premium ring-1 ring-black/5 dark:ring-white/10"
    : "relative inline-flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-950 p-0.5 shadow-premium ring-1 ring-black/5 dark:ring-white/10";

  const imageSizes = compact ? "64px" : "96px";

  return (
    <span className={cn(containerClassName, className)}>
      <Image
        src="/alhaduni-logo.jpg"
        alt={`${COMPANY_NAME} - ${COMPANY_SUBTITLE}`}
        fill
        priority={priority}
        sizes={imageSizes}
        className="object-cover object-center scale-[1.14]"
      />
    </span>
  );
}
