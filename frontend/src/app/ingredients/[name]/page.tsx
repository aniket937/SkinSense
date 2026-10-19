"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Loading";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { titleCase, unslugify } from "@/lib/format";
import { useProfile } from "@/lib/profile-context";
import { explainIngredient } from "@/services/ingredient";
import type { IngredientResult } from "@/services/ingredient";

export default function IngredientDetailPage() {
  const params = useParams<{ name: string }>();
  const searchParams = useSearchParams();
  const { profile } = useProfile();

  const name = titleCase(unslugify(params.name));
  const product = searchParams.get("product");

  const [detail, setDetail] = useState<IngredientResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(false);
    explainIngredient({ ingredient_name: name })
      .then(setDetail)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-4 h-12 w-2/3" />
        <Skeleton className="mt-5 h-5 w-3/4" />
        <Skeleton className="mt-3 h-5 w-full" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <ErrorState onRetry={refresh} />
      </div>
    );
  }

  if (!detail) return null;

  const isEmpty = !detail.what_it_is && detail.common_roles.length === 0;

  return (
    <article className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      {product && (
        <div className="mb-6">
          <Badge tone="amber">Discussing: {product}</Badge>
        </div>
      )}

      <header>
        <p className="eyebrow">Ingredient</p>
        <h1 className="display mt-2 text-3xl sm:text-4xl">{name}</h1>
      </header>

      {isEmpty ? (
        <div className="mt-6">
          <StatusBanner tone="uncertain" title="Not enough information">
            {detail.relevant_considerations[0] && (
              <p className="mt-1 text-sm">{detail.relevant_considerations[0]}</p>
            )}
          </StatusBanner>
        </div>
      ) : (
        <>
          {detail.what_it_is && (
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              {detail.what_it_is}
            </p>
          )}
        </>
      )}

      <div className="mt-8 space-y-6">
        {detail.common_roles.length > 0 && (
          <section aria-labelledby="roles-heading" className="brutal brutal-shadow bg-surface p-5 sm:p-6">
            <h2 id="roles-heading" className="display text-2xl">
              What it does
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {detail.common_roles.map((role) => (
                <li key={role}>
                  <Badge tone="sage">{role}</Badge>
                </li>
              ))}
            </ul>
          </section>
        )}

        {detail.relevant_considerations.length > 0 && (
          <section aria-labelledby="consider-heading" className="brutal brutal-shadow bg-paper p-5 sm:p-6">
            <h2 id="consider-heading" className="display text-2xl">
              What to know
            </h2>
            <ul className="mt-4 space-y-2">
              {detail.relevant_considerations.map((item) => (
                <li key={item} className="flex gap-2 text-base">
                  <span aria-hidden="true">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="context-heading" className="brutal brutal-shadow bg-surface p-5 sm:p-6">
          <h2 id="context-heading" className="display text-2xl">
            In your context
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            You told SkinSense:{" "}
            {[
              profile?.skin_behavior ? titleCase(profile.skin_behavior) : null,
              ...(profile?.concerns ?? []),
            ]
              .filter(Boolean)
              .join(", ") || "nothing yet"}
          </p>
          <p className="mt-2 text-base text-ink-soft">
            Keep your own context in mind — SkinSense doesn&apos;t assume this
            ingredient suits everyone.
          </p>
        </section>

        {detail.sources.length > 0 && (
          <section aria-labelledby="sources-heading" className="brutal brutal-shadow bg-surface p-5 sm:p-6">
            <h2 id="sources-heading" className="display text-2xl">
              Sources
            </h2>
            <ul className="mt-4 space-y-2">
              {detail.sources.map((source, index) => (
                <li key={`${source}-${index}`} className="flex gap-2 text-base text-ink-soft">
                  <span aria-hidden="true">·</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/check-product" className="btn btn-primary">
          Check a product with this
        </Link>
        <Link href={`/ask?topic=${encodeURIComponent(name)}`} className="btn">
          Ask about this
        </Link>
      </div>
    </article>
  );
}