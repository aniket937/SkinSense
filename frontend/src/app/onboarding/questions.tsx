"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { Input, Textarea } from "@/components/ui/Field";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import {
  concernOptions,
  prefOptions,
  sensitivityOptions,
  skinFeelOptions,
  type Option,
} from "./config";

type StepNav = {
  onBack: () => void;
  onNext: () => void;
};

type SingleStepProps = StepNav & {
  value: string | null;
  onChange: (value: string | null) => void;
};

type MultiStepProps = StepNav & {
  value: string[];
  onChange: (value: string[]) => void;
};

function toggleMulti(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function QuestionShell({
  current,
  title,
  sub,
  onBack,
  onNext,
  extraAction,
  error,
  children,
}: {
  current: number;
  title: string;
  sub?: string;
  onBack: () => void;
  onNext: () => void;
  extraAction?: React.ReactNode;
  error?: boolean;
  children: React.ReactNode;
}) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (error) headingRef.current?.focus();
  }, [error]);

  return (
    <section aria-labelledby={headingId}>
      <ProgressSteps current={current} total={6} />
      <h1
        ref={headingRef}
        id={headingId}
        tabIndex={-1}
        className="display mt-6 text-2xl outline-none sm:text-3xl"
      >
        {title}
      </h1>
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-rust">
          Choose one to continue.
        </p>
      )}
      {sub && <p className="mt-2 text-base text-ink-soft">{sub}</p>}
      <div role="group" aria-labelledby={headingId} className="mt-6 grid gap-3">
        {children}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button variant="quiet" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          {extraAction}
          <Button variant="primary" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SkinFeelStep({ value, onChange, onBack, onNext }: SingleStepProps) {
  const [error, setError] = useState(false);
  return (
    <QuestionShell
      current={1}
      title="How does your skin usually feel?"
      onBack={onBack}
      error={error}
      onNext={() => {
        if (!value) {
          setError(true);
          return;
        }
        setError(false);
        onNext();
      }}
    >
      {skinFeelOptions.map((option: Option) => (
        <ChoiceCard
          key={option.value}
          title={option.title}
          description={option.description}
          selected={value === option.value}
          onSelect={() => {
            setError(false);
            onChange(option.value);
          }}
        />
      ))}
    </QuestionShell>
  );
}

export function ConcernsStep({ value, onChange, onBack, onNext }: MultiStepProps) {
  return (
    <QuestionShell
      current={2}
      title="What do you notice most?"
      sub="Choose all that apply, or none to skip."
      onBack={onBack}
      onNext={onNext}
    >
      {concernOptions.map((option: Option) => (
        <ChoiceCard
          key={option.value}
          title={option.title}
          selected={value.includes(option.value)}
          onSelect={() => onChange(toggleMulti(value, option.value))}
        />
      ))}
    </QuestionShell>
  );
}

export function SensitivityStep({ value, onChange, onBack, onNext }: SingleStepProps) {
  const [error, setError] = useState(false);
  return (
    <QuestionShell
      current={3}
      title="How sensitive is your skin?"
      sub="How easily does your skin react to new products?"
      onBack={onBack}
      error={error}
      onNext={() => {
        if (!value) {
          setError(true);
          return;
        }
        setError(false);
        onNext();
      }}
    >
      {sensitivityOptions.map((option: Option) => (
        <ChoiceCard
          key={option.value}
          title={option.title}
          description={option.description}
          selected={value === option.value}
          onSelect={() => {
            setError(false);
            onChange(option.value);
          }}
        />
      ))}
    </QuestionShell>
  );
}

export function ProductsStep({
  value,
  onChange,
  draft,
  onDraftChange,
  onBack,
  onNext,
  onSkip,
}: MultiStepProps & {
  draft: string;
  onDraftChange: (value: string) => void;
  onSkip: () => void;
}) {
  const [lastAdded, setLastAdded] = useState("");

  function addProducts(raw: string) {
    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    const added: string[] = [];
    for (const part of parts) {
      if (!next.some((item) => item.toLowerCase() === part.toLowerCase())) {
        next.push(part);
        added.push(part);
      }
    }
    if (added.length > 0) {
      onChange(next);
      setLastAdded(added.join(", "));
    }
  }

  return (
    <QuestionShell
      current={4}
      title="What products do you currently use?"
      sub="Anything you reach for regularly — cleanser, serum, sunscreen, makeup."
      onBack={onBack}
      onNext={() => {
        if (draft.trim()) {
          addProducts(draft);
          onDraftChange("");
        }
        onNext();
      }}
      extraAction={
        <Button variant="quiet" onClick={onSkip}>
          Skip for now
        </Button>
      }
    >
      <div>
        <Input
          label="Add a product"
          hint="Press Enter or comma after each product."
          placeholder="e. gentle cleanser, sunscreen"
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            const commaIndex = next.lastIndexOf(",");
            if (commaIndex >= 0) {
              addProducts(next.slice(0, commaIndex));
              onDraftChange(next.slice(commaIndex + 1).trimStart());
            } else {
              onDraftChange(next);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (draft.trim()) {
                addProducts(draft);
                onDraftChange("");
              }
            }
          }}
        />
        <p aria-live="polite" className="sr-only">
          {lastAdded ? `Added: ${lastAdded}` : ""}
        </p>
        {value.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {value.map((product) => (
              <li
                key={product}
                className="brutal brutal-shadow-sm inline-flex items-center gap-1 bg-surface py-1 pl-3 pr-1 text-sm font-semibold"
              >
                <span>{product}</span>
                <button
                  type="button"
                  aria-label={`Remove ${product}`}
                  onClick={() => onChange(value.filter((item) => item !== product))}
                  className="flex h-11 w-11 items-center justify-center border-2 border-line bg-paper text-ink-soft hover:text-ink"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </QuestionShell>
  );
}

export function PrefsStep({ value, onChange, onBack, onNext }: MultiStepProps) {
  return (
    <QuestionShell
      current={5}
      title="Any preferences for your routine?"
      sub="Choose all that apply. Saved on this device only."
      onBack={onBack}
      onNext={onNext}
    >
      {prefOptions.map((option: Option) => (
        <ChoiceCard
          key={option.value}
          title={option.title}
          description={option.description}
          selected={value.includes(option.value)}
          onSelect={() => onChange(toggleMulti(value, option.value))}
        />
      ))}
    </QuestionShell>
  );
}

export function NotesStep({
  value,
  onChange,
  onBack,
  onNext,
}: StepNav & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <QuestionShell
      current={6}
      title="Anything else SkinSense should know?"
      sub="Optional. Saved on this device only."
      onBack={onBack}
      onNext={onNext}
    >
      <Textarea
        label="Your note"
        placeholder="Climate, schedule, anything that shapes how you care for your skin."
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </QuestionShell>
  );
}
