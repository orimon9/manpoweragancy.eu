import { cn } from "@/lib/utils";

/**
 * The agency mark. The source artwork has a cream background, so it always sits
 * on its own light tile — that keeps it legible on the navy footer and in dark
 * mode without needing a second cut-out version of the file.
 */
export function LogoMark({ className, size = 44 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f2efe9] shadow-e1", className)}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.jpg"
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
