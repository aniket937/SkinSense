import { StatusBanner } from "@/components/ui/StatusBanner";
import { cx } from "@/lib/cx";
import type { CompatibilityState } from "@/types/product";

type BlockProps = {
  state: CompatibilityState;
  warnings: string[];
};

const config: Record<
  CompatibilityState,
  { tone: "normal" | "caution" | "uncertain" | "escalation"; badge: string; note: string; fill: string }
> = {
  compatible: {
    tone: "normal",
    badge: "Reasonably compatible",
    note: "Based on what you've told SkinSense and the ingredients in this product, no clear conflicts showed up in this check.",
    fill: "bg-moss",
  },
  consider: {
    tone: "caution",
    badge: "Consider carefully",
    note: "Some information is uncertain. SkinSense found points worth checking before you decide.",
    fill: "bg-honey",
  },
  insufficient: {
    tone: "uncertain",
    badge: "Not enough information",
    note: "SkinSense doesn't have enough reliable information about the ingredients in this product to assess how it fits.",
    fill: "bg-sky",
  },
  escalation: {
    tone: "escalation",
    badge: "This may require professional attention",
    note: "SkinSense can't safely assess this situation and recommends checking with a professional before deciding.",
    fill: "bg-blush",
  },
};

export function CompatibilityBlock({ state, warnings }: BlockProps) {
  const option = config[state];
  return (
    <section aria-labelledby="compat-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="compat-heading" className="display text-2xl sm:text-3xl">
          How it fits your routine
        </h2>
        <span className={cx("eyebrow border-2 border-line bg-surface px-2 py-1", option.fill)}>
          {option.badge}
        </span>
      </div>
      <StatusBanner tone={option.tone} title={option.badge} body={option.note} />
      <div className="brutal brutal-shadow bg-surface p-5 sm:p-6">
        <p className="eyebrow">Why</p>
        <ul className="mt-3 space-y-2">
          {warnings.length > 0 ? (
            warnings.map((warning, index) => (
              <li key={index} className="flex gap-2 text-base">
                <span aria-hidden="true" className="mt-0.5">
                  –
                </span>
                <span>{warning}</span>
              </li>
            ))
          ) : (
            <li className="text-base">No conflicts were reported in this check.</li>
          )}
        </ul>
      </div>
      <div className="brutal brutal-shadow bg-paper p-5 sm:p-6">
        <p className="eyebrow">What to check</p>
        <ul className="mt-3 space-y-2">
          {[
            "The full ingredient list on the product",
            "How it fits with your current routine",
            "A patch test, to see how your skin actually responds",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-base">
              <span aria-hidden="true" className="mt-0.5">
                ·
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}