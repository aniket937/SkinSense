"use client";

import { cx } from "@/lib/cx";

type ChoiceCardProps = {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
};

export function ChoiceCard({ title, description, selected, onSelect, icon }: ChoiceCardProps) {
  return (
    <button
      type="button"
      className="choice"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cx(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-line text-sm font-bold",
            selected ? "bg-clay-deep text-surface" : "bg-surface"
          )}
        >
          {selected ? "✓" : ""}
        </span>
        <span className="flex-1">
          <span className="block text-base font-semibold leading-snug">{title}</span>
          {description && (
            <span className="mt-1 block text-sm font-normal text-ink-soft">{description}</span>
          )}
        </span>
        {icon && <span aria-hidden="true">{icon}</span>}
      </span>
    </button>
  );
}
