import { cx } from "@/lib/cx";

const toneClass = {
  ink: "bg-ink text-surface",
  clay: "bg-clay-deep text-surface",
  sage: "bg-moss text-ink",
  amber: "bg-honey text-ink",
  muted: "bg-surface text-ink-soft",
} as const;

type BadgeProps = {
  children: React.ReactNode;
  tone?: keyof typeof toneClass;
  className?: string;
};

export function Badge({ children, tone = "muted", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 border-2 border-line px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
