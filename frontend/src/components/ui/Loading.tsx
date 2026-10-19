import { cx } from "@/lib/cx";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent"
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx("block animate-pulse border-2 border-line bg-blush/50", className)}
    />
  );
}

export function LoadingStages({ stages, activeIndex }: { stages: string[]; activeIndex: number }) {
  return (
    <ol aria-live="polite" className="space-y-3">
      {stages.map((stage, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <li key={stage} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden="true"
              className={cx(
                "flex h-6 w-6 items-center justify-center border-2 border-line text-xs font-bold",
                done ? "bg-sage text-surface" : active ? "bg-clay-deep text-surface" : "bg-surface text-ink-faint"
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            <span className={cx(active ? "font-semibold" : done ? "text-ink-soft" : "text-ink-faint")}>
              {stage}
            </span>
            {active && <Spinner label={stage} />}
          </li>
        );
      })}
    </ol>
  );
}

export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10">
      <Spinner label={label} />
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
    </div>
  );
}
