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
    ? "relative inline-flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-950 p-1 shadow-premium ring-1 ring-black/5 dark:ring-white/10"
    : "relative inline-flex h-[72px] w-[240px] shrink-0 overflow-hidden rounded-[24px] bg-zinc-950 p-1.5 shadow-premium ring-1 ring-black/5 dark:ring-white/10";

  const imageClassName = compact ? "rounded-xl" : "rounded-[18px]";
  const imageSizes = compact ? "56px" : "240px";

  if (compact) {
    return (
      <span className={cn(containerClassName, className)}>
        <Image
          src="/alhaduni-logo.jpg"
          alt={COMPANY_NAME}
          width={1024}
          height={1024}
          priority={priority}
          sizes={imageSizes}
          className={cn("h-full w-full object-cover object-center", imageClassName)}
        />
      </span>
    );
  }

  return (
    <span className={cn(containerClassName, className)}>
      <Image
        src="/alhaduni-logo.jpg"
        alt={`${COMPANY_NAME} - ${COMPANY_SUBTITLE}`}
        width={1024}
        height={1024}
        priority={priority}
        sizes={imageSizes}
        className={cn("h-full w-full object-cover object-center", imageClassName)}
      />
    </span>
  );
}
