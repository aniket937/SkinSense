import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { slugify } from "@/lib/format";
import type { IngredientAnalysisEntry } from "@/types/product";

function suitableBadge(suitable: boolean | null) {
  if (suitable === true) {
    return <Badge tone="sage">Compatible with your context</Badge>;
  }
  if (suitable === false) {
    return <Badge tone="amber">Check this one</Badge>;
  }
  return <Badge tone="muted">Unknown — not in SkinSense&apos;s reference</Badge>;
}

export function IngredientCard({ entry }: { entry: IngredientAnalysisEntry }) {
  return (
    <article className="brutal brutal-shadow bg-surface p-5">
      <h3 className="display text-lg">{entry.ingredient}</h3>
      {suitableBadge(entry.suitable)}
      {entry.roles.length > 0 && (
        <p className="mt-3 text-sm text-ink-soft">
          {entry.roles.join(", ")}
        </p>
      )}
      {entry.contraindications.length > 0 && (
        <ul className="mt-3 space-y-1">
          {entry.contraindications.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span aria-hidden="true">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Link href={`/ingredients/${slugify(entry.ingredient)}`} className="btn btn-sm">
          Learn more
        </Link>
      </div>
    </article>
  );
}