"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { LoadingStages } from "@/components/ui/Loading";
import { CompatibilityBlock } from "@/components/domain/CompatibilityBlock";
import { IngredientCard } from "@/components/domain/IngredientCard";
import { cx } from "@/lib/cx";
import { useProfile } from "@/lib/profile-context";
import { STORAGE_KEYS, saveJSON } from "@/lib/storage";
import { readProductImage } from "@/services/ocr";
import { checkProduct } from "@/services/product";
import type {
  CompatibilityState,
  ProductAnalysisMeta,
  ProductCheckResult,
} from "@/types/product";

type InputTab = "photo" | "paste" | "details";
type View = "input" | "loading" | "ocr-failed" | "result" | "error";

const MAX_BYTES = 8 * 1024 * 1024;

const pasteStages = ["Reading what you entered", "Comparing with your routine"];
const photoStages = ["Preparing image", "Reading label"];

function deriveCompatibility(result: ProductCheckResult): CompatibilityState {
  const entries = result.ingredient_analysis;
  if (entries.length > 0 && entries.every((entry) => entry.suitable === null)) {
    return "insufficient";
  }
  if (
    result.recommendations.some((item) => /dermatologist/i.test(item))
  ) {
    return "escalation";
  }
  if (
    result.recommendations.some((item) => /compatible/i.test(item)) &&
    result.warnings.length === 0
  ) {
    return "compatible";
  }
  return "consider";
}

function parseIngredients(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  text
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .forEach((item) => {
      if (!item) return;
      const normalized = item.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        out.push(item);
      }
    });
  return out;
}

function ChipsInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const [live, setLive] = useState("");

  function commit() {
    const next = draft.trim();
    if (!next) return;
    if (!values.some((item) => item.toLowerCase() === next.toLowerCase())) {
      onChange([...values, next]);
    }
    setDraft("");
    setLive("");
  }

  return (
    <div>
      <span className="mb-2 block">
        <span className="block text-sm font-semibold">{label}</span>
        <span id="chips-status" className="sr-only" aria-live="polite">
          {live ? `Added: ${live}` : ""}
        </span>
      </span>
      {values.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {values.map((value) => (
            <li key={value}>
              <span className="inline-flex items-center gap-1 border-2 border-line bg-surface px-2 py-1 text-sm font-semibold">
                {value}
                <button
                  type="button"
                  aria-label={`Remove ${value}`}
                  className="flex h-11 w-11 -m-1 ml-0 items-center justify-center text-base"
                  onClick={() => {
                    onChange(values.filter((item) => item !== value));
                    setLive("");
                  }}
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <input
        className="field"
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const value = draft.trim();
            if (value) setLive(value);
            commit();
          }
        }}
        onBlur={() => {
          if (draft.trim()) {
            setLive(draft.trim());
          }
          commit();
        }}
        aria-label={label}
      />
    </div>
  );
}

export default function CheckProductPage() {
  const { profile } = useProfile();

  const [tab, setTab] = useState<InputTab>("photo");
  const [view, setView] = useState<View>("input");
  const [stageIndex, setStageIndex] = useState(0);
  const [phaseError, setPhaseError] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [ingredientList, setIngredientList] = useState("");
  const [ingredientChips, setIngredientChips] = useState<string[]>([]);

  const [result, setResult] = useState<ProductCheckResult | null>(null);
  const [meta, setMeta] = useState<ProductAnalysisMeta | null>(null);

  const timers = useRef<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  function acceptFile(candidate: File) {
    if (!candidate.type.startsWith("image/")) {
      setFileError("That file doesn't look like a photo. Try a PNG, JPG, or WebP image.");
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setFileError("That photo is larger than 8 MB. Try a smaller image.");
      return;
    }
    setFileError(null);
    setFile(candidate);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(URL.createObjectURL(candidate));
  }

  function removeFile() {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setFileError(null);
  }

  async function handlePhotoAnalyze() {
    if (!file) return;
    clearTimers();
    setPhaseError(false);
    setView("loading");
    setStageIndex(0);
    timers.current = [
      window.setTimeout(() => setStageIndex(1), 400),
      window.setTimeout(() => setStageIndex(2), 1800),
    ];
    const discovered = await readProductImage(file);
    if (!discovered.ok) {
      clearTimers();
      setView("ocr-failed");
      return;
    }
  }

  async function handleAnalyze() {
    const ingredients =
      tab === "details" ? ingredientChips : parseIngredients(ingredientList);
    if (ingredients.length === 0) {
      setPhaseError(true);
      return;
    }
    setPhaseError(false);
    clearTimers();
    setView("loading");
    setStageIndex(0);
    timers.current = [
      window.setTimeout(() => setStageIndex(1), 300),
    ];
    const input = {
      product_name: productName.trim() || (tab === "details" ? "" : productName.trim()),
      ingredients,
      skin_behavior: profile?.skin_behavior ?? "",
      concerns: profile?.concerns ?? [],
    };
    try {
      const response: ProductCheckResult = await checkProduct(input);
      clearTimers();
      const recognized = response.ingredient_analysis.filter(
        (entry) => entry.suitable !== null
      ).length;
      const unknown = response.ingredient_analysis.filter(
        (entry) => entry.suitable === null
      ).length;
      const analysisMeta: ProductAnalysisMeta = {
        brand: tab === "details" ? (brand.trim() || null) : null,
        ingredientsProvided: ingredients,
        recognized,
        unknown,
        freeForm: tab === "paste",
      };
      setMeta(analysisMeta);
      setResult(response);
      saveJSON(STORAGE_KEYS.lastAnalysis, response);
      setView("result");
    } catch {
      clearTimers();
      setView("error");
    }
  }

  const compatibility = result ? deriveCompatibility(result) : null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <section aria-labelledby="check-heading">
        <p className="eyebrow">Product check</p>
        <h1 id="check-heading" className="display mt-2 text-3xl sm:text-4xl">
          Check This Product
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          Understand what&apos;s in it and how it fits with what you already use.
        </p>
      </section>

      {view === "input" && (
        <div className="mt-8">
          <div
            role="tablist"
            aria-label="How to enter the product"
            className="grid w-full grid-cols-3 border-2 border-line bg-surface"
          >
            {(
              [
                ["photo", "Upload Photo"],
                ["paste", "Paste Ingredient List"],
                ["details", "Enter Product Details"],
              ] as const
            ).map(([value, label]) => {
              const active = tab === value;
              return (
                <button
                  key={value}
                  role="tab"
                  id={`input-tab-${value}`}
                  aria-selected={active}
                  aria-controls={`input-panel-${value}`}
                  onClick={() => setTab(value)}
                  className={cx(
                    "px-2 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm",
                    active ? "bg-ink text-surface" : "text-ink-soft hover:bg-blush"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-6" id={`input-panel-${tab}`} role="tabpanel">
            {tab === "photo" && (
              <div>
                <div className="brutal brutal-shadow bg-surface p-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    id="product-photo"
                    onChange={(event) => {
                      const candidate = event.target.files?.[0];
                      if (candidate) acceptFile(candidate);
                    }}
                  />
                  {!file ? (
                    <label
                      htmlFor="product-photo"
                      className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-ink-soft p-6 text-center"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const candidate = event.dataTransfer.files?.[0];
                        if (candidate) acceptFile(candidate);
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 items-center justify-center border-2 border-line bg-paper text-xl"
                      >
                        ▲
                      </span>
                      <span className="text-base font-semibold">
                        Drop product photo — or choose an image
                      </span>
                      <span className="text-sm text-ink-soft">
                        PNG, JPG, or WebP · up to 8 MB
                      </span>
                    </label>
                  ) : (
                    <div>
                      {filePreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={filePreview}
                          alt={`Preview of ${file.name}`}
                          className="brutal brutal-shadow-sm h-40 w-40 border-line bg-paper object-contain"
                        />
                      )}
                      <p className="mt-3 text-sm font-semibold">{file.name}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button variant="primary" onClick={handlePhotoAnalyze}>
                          Analyze Photo
                        </Button>
                        <label htmlFor="product-photo" className="btn">
                          Replace
                        </label>
                        <Button variant="quiet" onClick={removeFile}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  The label-reading service isn&apos;t connected in this build, so a
                  photo alone can&apos;t start an analysis. You can still see how a
                  photo check behaves.
                </p>
              </div>
            )}

            {tab === "paste" && (
              <div className="space-y-4">
                <InputField
                  label="Product name (optional)"
                  value={productName}
                  onChange={setProductName}
                />
                <div>
                  <span className="mb-2 block text-sm font-semibold">
                    Ingredient list
                  </span>
                  <textarea
                    className="field min-h-40"
                    value={ingredientList}
                    onChange={(event) => setIngredientList(event.target.value)}
                    placeholder={"One ingredient per line — or separated by commas.\n\ne.g.\nwater\nglycerin\nniacinamide"}
                  />
                </div>
                {phaseError && (
                  <StatusBanner
                    tone="error"
                    title="An ingredient list is needed"
                    body="Enter at least one ingredient to start."
                  />
                )}
                <Button variant="primary" onClick={handleAnalyze}>
                  Analyze
                </Button>
              </div>
            )}

            {tab === "details" && (
              <div className="space-y-5">
                <InputField
                  label="Product name"
                  value={productName}
                  onChange={setProductName}
                />
                <InputField
                  label="Brand"
                  hint="Kept on this screen only — not sent for analysis."
                  value={brand}
                  onChange={setBrand}
                />
                <ChipsInput
                  label="Ingredients"
                  values={ingredientChips}
                  onChange={setIngredientChips}
                  placeholder="e.g. niacinamide, then press Enter"
                />
                {phaseError && (
                  <StatusBanner
                    tone="error"
                    title="At least one ingredient is needed"
                    body="Add an ingredient to start the check."
                  />
                )}
                <Button variant="primary" onClick={handleAnalyze}>
                  Check Product
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {view === "loading" && (
        <Card className="mt-8">
          <LoadingStages
            stages={tab === "photo" ? photoStages : pasteStages}
            activeIndex={stageIndex > 1 ? 1 : stageIndex}
          />
        </Card>
      )}

      {view === "ocr-failed" && (
        <div className="mt-8 space-y-5">
          <StatusBanner
            tone="uncertain"
            title="We couldn't read enough from this image."
            body="Try: a clearer photo, better lighting, a closer crop — or enter the ingredient list manually."
          />
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setTab("paste");
                setView("input");
              }}
            >
              Enter ingredients manually
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                removeFile();
                setView("input");
              }}
            >
              Try another photo
            </Button>
          </div>
        </div>
      )}

      {view === "error" && (
        <div className="mt-8">
          <ErrorState
            body="SkinSense couldn't complete this analysis right now. Your information hasn't been lost."
            onRetry={handleAnalyze}
          />
        </div>
      )}

      {view === "result" && result && compatibility && (
        <div className="mt-8 space-y-8">
          {compatibility === "escalation" && (
            <StatusBanner
              tone="escalation"
              title="This should be checked before you use it"
              body="Something in the analysis pointed to a potential conflict. Read the details below, and consider a professional before deciding."
            />
          )}

          <Card>
            <p className="eyebrow">Product overview</p>
            <h2 className="display mt-1 text-2xl sm:text-3xl">
              {result.product_name || "Unnamed product"}
            </h2>
            <p className="mt-2 text-base text-ink-soft">
              Brand: {meta?.brand ?? "Not available"}
            </p>
          </Card>

          <CompatibilityBlock state={compatibility} warnings={result.warnings} />

          <section aria-labelledby="found-heading" className="grid gap-4 sm:grid-cols-2">
            <Card tone="moss">
              <h3 id="found-heading" className="display text-xl">
                What we found
              </h3>
              {(result.warnings.length > 0 || result.recommendations.length > 0) ? (
                <div className="mt-4 space-y-4">
                  {result.warnings.length > 0 && (
                    <div>
                      <p className="eyebrow">Points raised</p>
                      <ul className="mt-2 space-y-2">
                        {result.warnings.map((warning) => (
                          <li key={warning} className="flex gap-2 text-base">
                            <span aria-hidden="true">·</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.recommendations.length > 0 && (
                    <div>
                      <p className="eyebrow">Recommendations from this check</p>
                      <ul className="mt-2 space-y-2">
                        {result.recommendations.map((recommendation) => (
                          <li key={recommendation} className="flex gap-2 text-base">
                            <span aria-hidden="true">–</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-base text-ink-soft">
                  This check raised no specific concerns.
                </p>
              )}
            </Card>

            <Card tone="honey">
              <h3 className="display text-xl">Things to consider</h3>
              <div className="mt-3 space-y-2">
                <p className="text-base text-ink-soft">
                  The rest of this check only repeats what the analysis found above.
                </p>
                {result.ingredient_analysis.length === 0 && (
                  <p className="text-base text-ink-soft">
                    No ingredients were recognized from the reference list.
                  </p>
                )}
              </div>
            </Card>
          </section>

          {result.ingredient_analysis.length > 0 && (
            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="display text-2xl">
                Key ingredients
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {result.ingredient_analysis.map((entry) => (
                  <IngredientCard key={entry.ingredient} entry={entry} />
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="consider-heading">
            <h2 id="consider-heading" className="display text-2xl">
              What SkinSense knows, and what it doesn&apos;t
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="brutal brutal-shadow bg-surface p-5">
                <p className="eyebrow">Known</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex gap-2 text-base">
                    <span aria-hidden="true">✓</span>
                    <span>Ingredient list provided</span>
                  </li>
                  <li className="flex gap-2 text-base">
                    <span aria-hidden="true">✓</span>
                    <span>
                      {meta?.recognized ?? 0} ingredient
                      {meta?.recognized === 1 ? "" : "s"} recognized from the
                      reference list
                    </span>
                  </li>
                </ul>
              </div>
              <div className="brutal brutal-shadow bg-paper p-5">
                <p className="eyebrow">Uncertain</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex gap-2 text-base">
                    <span aria-hidden="true">?</span>
                    <span>Exact concentration is unavailable</span>
                  </li>
                  <li className="flex gap-2 text-base">
                    <span aria-hidden="true">?</span>
                    <span>
                      Brand is{" "}
                      {meta?.brand ? "kept local" : "not available"} for this check
                    </span>
                  </li>
                  {meta && meta.unknown > 0 && (
                    <li className="flex gap-2 text-base">
                      <span aria-hidden="true">?</span>
                      <span>
                        {meta.unknown} ingredient
                        {meta.unknown === 1 ? "" : "s"} wasn&apos;t in the reference
                        list
                      </span>
                    </li>
                  )}
                  {meta?.freeForm && (
                    <li className="flex gap-2 text-base">
                      <span aria-hidden="true">?</span>
                      <span>Label text may be incomplete</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/ask?product=${encodeURIComponent(result.product_name)}`}
              className="btn btn-primary"
            >
              Ask SkinSense about this
            </Link>
            <Link href="/ingredients" className="btn">
              Explore an ingredient
            </Link>
            <Button
              variant="quiet"
              onClick={() => {
                setView("input");
                setResult(null);
                setMeta(null);
              }}
            >
              Check another product
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={label} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      {hint && <p className="mb-1 text-sm text-ink-soft">{hint}</p>}
      <input
        id={label}
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}