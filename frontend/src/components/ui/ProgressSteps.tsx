import { cx } from "@/lib/cx";

type ProgressStepsProps = {
  current: number;
  total: number;
  label?: string;
};

export function ProgressSteps({ current, total, label }: ProgressStepsProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow" aria-live="polite">
        {label ?? `${pad(current)} / ${pad(total)}`}
      </p>
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cx(
              "h-2 flex-1 border-2 border-line",
              index < current ? "bg-clay" : "bg-surface"
            )}
          />
        ))}
      </div>
      <span className="sr-only">
        Step {current} of {total}
      </span>
    </div>
  );
}
