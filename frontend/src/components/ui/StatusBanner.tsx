import { cx } from "@/lib/cx";

export type BannerTone = "normal" | "caution" | "uncertain" | "escalation" | "error" | "demo";

const toneStyle: Record<
  BannerTone,
  { className: string; icon: string; defaultBody?: string }
> = {
  normal: { className: "bg-surface", icon: "•" },
  caution: { className: "bg-honey", icon: "!", defaultBody: "Some information is uncertain." },
  uncertain: {
    className: "bg-sky",
    icon: "?",
    defaultBody: "SkinSense doesn't have enough reliable information to assess this confidently.",
  },
  escalation: {
    className: "bg-blush",
    icon: "⚠",
    defaultBody: "SkinSense can't safely assess this situation.",
  },
  error: { className: "bg-blush", icon: "×" },
  demo: {
    className: "bg-honey",
    icon: "◌",
    defaultBody: "This answer came from SkinSense's local demo layer — the reasoning endpoint isn't connected yet.",
  },
};

const defaultTitle: Partial<Record<BannerTone, string>> = {
  normal: "Based on the information provided…",
  caution: "Consider carefully",
  uncertain: "Not enough information",
  escalation: "This may require professional attention.",
  demo: "Demo response",
};

type StatusBannerProps = {
  tone: BannerTone;
  title?: string;
  body?: string;
  children?: React.ReactNode;
  className?: string;
};

export function StatusBanner({ tone, title, body, children, className }: StatusBannerProps) {
  const style = toneStyle[tone];
  const heading = title ?? defaultTitle[tone] ?? "";
  const text = body ?? style.defaultBody;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("brutal brutal-shadow-sm flex gap-3 p-4", style.className, className)}
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-line bg-surface text-sm font-bold"
      >
        {style.icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold uppercase tracking-wide">{heading}</p>
        {text && <p className="mt-1 text-sm text-ink-soft">{text}</p>}
        {children && <div className="mt-2 text-sm">{children}</div>}
      </div>
    </div>
  );
}
