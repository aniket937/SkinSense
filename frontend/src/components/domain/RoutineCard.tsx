import { titleCase } from "@/lib/format";
import type { RoutineStep } from "@/types/routine";

export function RoutineCard({ step }: { step: RoutineStep }) {
  return (
    <article className="brutal brutal-shadow bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="display flex h-12 w-12 shrink-0 items-center justify-center border-2 border-line bg-paper text-xl"
        >
          {String(step.step).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="display text-xl">{titleCase(step.category)}</h3>
          <p className="mt-1 text-base text-ink-soft">{step.purpose}</p>
          <p className="eyebrow mt-3">Why this is here</p>
          <p className="mt-1 text-base">{step.why}</p>
        </div>
      </div>
    </article>
  );
}