"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { cx } from "@/lib/cx";
import { slugify, titleCase } from "@/lib/format";

const catalog: { name: string; category: string }[] = [
  { name: "Niacinamide", category: "Barrier" },
  { name: "Salicylic Acid", category: "Exfoliants" },
  { name: "Hyaluronic Acid", category: "Hydrators" },
  { name: "Retinol", category: "Brightening" },
  { name: "Vitamin C", category: "Brightening" },
  { name: "Ceramide", category: "Barrier" },
  { name: "AHA", category: "Exfoliants" },
  { name: "Azelaic Acid", category: "Acne care" },
  { name: "Benzoyl Peroxide", category: "Acne care" },
  { name: "Peptides", category: "Barrier" },
];

const popular = ["Niacinamide", "Salicylic Acid", "Hyaluronic Acid", "Retinol", "Vitamin C", "Ceramide"];
const commonActives = ["AHA", "Azelaic Acid", "Benzoyl Peroxide", "Peptides"];
const categories = ["Exfoliants", "Hydrators", "Barrier", "Brightening", "Acne care"];

function IngredientCard({ name, category }: { name: string; category: string }) {
  return (
    <Link
      href={`/ingredients/${slugify(name)}`}
      className="brutal brutal-shadow-sm bg-surface p-5 transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-line)]"
    >
      <p className="eyebrow">{category}</p>
      <h2 className="display mt-1 text-xl">{name}</h2>
      <span aria-hidden="true" className="mt-3 block text-ink-soft">
        →
      </span>
    </Link>
  );
}

export default function IngredientsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? catalog.filter((item) => item.name.toLowerCase().includes(normalized))
    : category === "all"
      ? catalog
      : catalog.filter((item) => item.category === category);

  function submitSearch() {
    const term = normalized;
    if (!term) return;
    const match = catalog.find(
      (item) =>
        item.name.toLowerCase().includes(term) || term.includes(item.name.toLowerCase())
    );
    if (match) {
      router.push(`/ingredients/${slugify(match.name)}`);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <section aria-labelledby="ingredients-heading">
        <p className="eyebrow">Learn as you go</p>
        <h1 id="ingredients-heading" className="display mt-2 text-3xl sm:text-4xl">
          Ingredients
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          Skincare terms, explained simply.
        </p>
      </section>

      <div className="mt-8">
        <div role="search" className="flex gap-0 border-2 border-line bg-surface">
          <input
            aria-label="Search ingredients"
            className="w-full border-0 bg-transparent px-4 py-3 text-base focus:outline-none"
            placeholder="Search for an ingredient…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitSearch();
            }}
          />
          <button
            type="button"
            className="border-l-2 border-line bg-ink px-4 text-sm font-bold uppercase tracking-wide text-surface"
            onClick={submitSearch}
          >
            Open
          </button>
        </div>
      </div>

      {normalized && filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon="?"
            title="No ingredient found"
            body={`SkinSense doesn't have "${query.trim()}" in its reference list yet. You can ask about it directly.`}
            action={{ label: "Ask SkinSense about it", href: `/ask?topic=${encodeURIComponent(query.trim())}` }}
          />
        </div>
      ) : (
        <>
          {!normalized && (
            <>
              <section className="mt-10" aria-labelledby="popular-heading">
                <h2 id="popular-heading" className="display text-2xl">
                  Popular ingredients
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {popular.map((name) => {
                    const item = catalog.find((c) => c.name === name);
                    return item ? (
                      <IngredientCard key={name} name={item.name} category={item.category} />
                    ) : null;
                  })}
                </div>
              </section>

              <section className="mt-10" aria-labelledby="actives-heading">
                <h2 id="actives-heading" className="display text-2xl">
                  Common actives
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {commonActives.map((name) => {
                    const item = catalog.find((c) => c.name === name);
                    return item ? (
                      <IngredientCard key={name} name={item.name} category={item.category} />
                    ) : null;
                  })}
                </div>
              </section>
            </>
          )}

          <section className="mt-10" aria-labelledby="category-heading">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Categories</span>
              <button
                type="button"
                className={cx(
                  "border-2 border-line px-3 py-1.5 text-sm font-semibold",
                  category === "all" ? "bg-ink text-surface" : "bg-surface hover:bg-blush"
                )}
                onClick={() => setCategory("all")}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cx(
                    "border-2 border-line px-3 py-1.5 text-sm font-semibold",
                    category === item ? "bg-ink text-surface" : "bg-surface hover:bg-blush"
                  )}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <h2 id="category-heading" className="display mt-6 text-2xl">
              {normalized ? titleCase(normalized) : category === "all" ? "All ingredients" : category}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <IngredientCard key={item.name} name={item.name} category={item.category} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}