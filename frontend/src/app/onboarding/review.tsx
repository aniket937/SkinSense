"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { titleCase } from "@/lib/format";
import type { Answers, QuestionIndex } from "./config";

function NotProvided() {
  return <span className="text-base font-semibold text-ink-soft">Not provided</span>;
}

type ReviewScreenProps = {
  answers: Answers;
  saving: boolean;
  saveError: boolean;
  onConfirm: () => void;
  onBack: () => void;
  onEdit: (step: QuestionIndex) => void;
};

function FactRow({
  label,
  step,
  onEdit,
  children,
}: {
  label: string;
  step: QuestionIndex;
  onEdit: (step: QuestionIndex) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="brutal brutal-shadow-sm bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        <Button
          variant="quiet"
          size="sm"
          onClick={() => onEdit(step)}
          aria-label={`Edit ${label.toLowerCase()}`}
        >
          Edit
        </Button>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} tone="muted">
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function ReviewScreen({
  answers,
  saving,
  saveError,
  onConfirm,
  onBack,
  onEdit,
}: ReviewScreenProps) {
  return (
    <section aria-labelledby="review-heading">
      <p className="eyebrow">Review</p>
      <h1 id="review-heading" className="display mt-2 text-2xl sm:text-3xl">
        Look over your answers.
      </h1>
      <p className="mt-2 text-base text-ink-soft">
        Facts first, then what SkinSense reads from them. Fix anything before it is saved.
      </p>

      <div className="mt-6">
        <h2 className="display text-xl">You told SkinSense…</h2>
        <div className="mt-3 grid gap-3">
          <FactRow label="How your skin usually feels" step={1} onEdit={onEdit}>
            {answers.skinBehavior ? (
              <span className="text-base font-semibold">{titleCase(answers.skinBehavior)}</span>
            ) : (
              <NotProvided />
            )}
          </FactRow>
          <FactRow label="What you notice most" step={2} onEdit={onEdit}>
            {answers.concerns.length ? (
              <BadgeList items={answers.concerns.map(titleCase)} />
            ) : (
              <NotProvided />
            )}
          </FactRow>
          <FactRow label="How sensitive your skin is" step={3} onEdit={onEdit}>
            {answers.sensitivity ? (
              <span className="text-base font-semibold">{titleCase(answers.sensitivity)}</span>
            ) : (
              <NotProvided />
            )}
          </FactRow>
          <FactRow label="Products you currently use" step={4} onEdit={onEdit}>
            {answers.products.length ? (
              <BadgeList items={answers.products} />
            ) : (
              <NotProvided />
            )}
          </FactRow>
          <FactRow label="Routine preferences" step={5} onEdit={onEdit}>
            {answers.prefs.length ? (
              <BadgeList items={answers.prefs.map(titleCase)} />
            ) : (
              <NotProvided />
            )}
          </FactRow>
          <FactRow label="Anything else" step={6} onEdit={onEdit}>
            {answers.notes.trim() ? (
              <p className="whitespace-pre-wrap break-words text-base">{answers.notes}</p>
            ) : (
              <NotProvided />
            )}
          </FactRow>
        </div>
      </div>

      <div className="mt-6">
        <Card tone="honey">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="display text-xl">SkinSense suggests…</h2>
            <Badge tone="amber">Suggested from your answers</Badge>
          </div>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="eyebrow">How SkinSense will read your skin</dt>
              <dd className="mt-1">
                {answers.skinBehavior ? (
                  <span className="text-base font-semibold">{titleCase(answers.skinBehavior)}</span>
                ) : (
                  <NotProvided />
                )}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Focus areas for your routine</dt>
              <dd className="mt-1">
                {answers.concerns.length ? (
                  <BadgeList items={answers.concerns.map(titleCase)} />
                ) : (
                  <NotProvided />
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-ink-soft">
            A plain reading of your answers — not a diagnosis, and not a promise of results.
          </p>
        </Card>
      </div>

      {saveError && (
        <div className="mt-6">
          <ErrorState
            title="Couldn't save your profile."
            body="SkinSense couldn't save your answers right now. Your answers are still here — try again."
            onRetry={onConfirm}
          />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button variant="quiet" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" loading={saving} onClick={onConfirm}>
          Confirm &amp; Continue
        </Button>
      </div>
    </section>
  );
}
