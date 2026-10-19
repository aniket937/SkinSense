"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Field";
import { cx } from "@/lib/cx";

type SectionCardProps = {
  title: string;
  editing: boolean;
  saved: boolean;
  saving: boolean;
  saveError: boolean;
  value: React.ReactNode;
  footnote?: React.ReactNode;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  editing,
  saved,
  saving,
  saveError,
  value,
  footnote,
  onEdit,
  onCancel,
  onSave,
  children,
}: SectionCardProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevEditing = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevEditing.current !== null && prevEditing.current !== editing) {
      headingRef.current?.focus();
    }
    prevEditing.current = editing;
  }, [editing]);

  return (
    <div>
      <Card as="section">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              ref={headingRef}
              id={headingId}
              tabIndex={-1}
              className="display text-2xl"
            >
              {title}
            </h2>
            {!editing && <p className="mt-2 text-base font-semibold">{value}</p>}
          </div>
          {!editing && (
            <Button onClick={onEdit}>
              Edit<span className="sr-only"> {title}</span>
            </Button>
          )}
        </div>

        {!editing && footnote && (
          <p className="mt-3 text-sm text-ink-soft">{footnote}</p>
        )}

        {editing && (
          <div role="group" aria-labelledby={headingId} className="mt-4">
            {children}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={onSave} loading={saving}>
                Save
              </Button>
              <Button variant="secondary" onClick={onCancel} disabled={saving}>
                Cancel
              </Button>
            </div>
            {saveError && (
              <div className="mt-4">
                <ErrorState
                  title="Couldn't save your changes."
                  body="SkinSense couldn't save this section right now. Your edits are still here — try again."
                  onRetry={onSave}
                  retryLabel="Try again"
                />
              </div>
            )}
          </div>
        )}

        <p
          aria-live="polite"
          className={cx(
            !editing && saved ? "mt-3 text-sm font-semibold text-sage" : "sr-only"
          )}
        >
          {!editing && saved ? "Saved." : ""}
        </p>
      </Card>
    </div>
  );
}

type ChipOption = {
  value: string;
  title: string;
};

type ChipEditorProps = {
  label: string;
  hint?: string;
  placeholder?: string;
  values: string[];
  onChange: (next: string[]) => void;
  options?: ChipOption[];
  optionsLabel?: string;
};

export function ChipEditor({
  label,
  hint,
  placeholder,
  values,
  onChange,
  options,
  optionsLabel,
}: ChipEditorProps) {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  function add(raw: string) {
    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...values];
    const added: string[] = [];
    for (const part of parts) {
      if (!next.some((item) => item.toLowerCase() === part.toLowerCase())) {
        next.push(part);
        added.push(part);
      }
    }
    if (added.length === 0) return;
    onChange(next);
    setStatus(`Added: ${added.join(", ")}`);
  }

  function remove(item: string) {
    onChange(values.filter((value) => value !== item));
    setStatus(`Removed: ${item}`);
  }

  return (
    <div>
      {options && optionsLabel && (
        <div>
          <p className="eyebrow mb-2">{optionsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const match = values.find(
                (value) => value.toLowerCase() === option.value.toLowerCase()
              );
              const active = Boolean(match);
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    match ? remove(match) : add(option.value)
                  }
                  className={cx(
                    "inline-flex min-h-11 items-center gap-2 border-2 border-line px-4 text-sm font-semibold",
                    active
                      ? "bg-clay-deep text-surface"
                      : "bg-surface text-ink hover:bg-blush"
                  )}
                >
                  <span aria-hidden="true">{active ? "✓" : "+"}</span>
                  {option.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={cx(options && optionsLabel && "mt-4")}>
        <Input
          label={label}
          hint={hint}
          placeholder={placeholder}
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            const commaIndex = next.lastIndexOf(",");
            if (commaIndex >= 0) {
              add(next.slice(0, commaIndex));
              setDraft(next.slice(commaIndex + 1).trimStart());
            } else {
              setDraft(next);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (draft.trim()) {
                add(draft);
                setDraft("");
              }
            }
          }}
        />
        <p aria-live="polite" className="sr-only">
          {status}
        </p>
      </div>

      {values.length > 0 && (
        <div className="mt-4">
          {options && optionsLabel && <p className="eyebrow mb-2">Selected</p>}
          <ul className="flex flex-wrap gap-2">
            {values.map((item) => (
              <li
                key={item}
                className="brutal brutal-shadow-sm inline-flex items-center gap-1 bg-surface py-1 pl-3 pr-1 text-sm font-semibold"
              >
                <span>{item}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={() => remove(item)}
                  className="flex h-11 w-11 items-center justify-center border-2 border-line bg-paper text-ink-soft hover:text-ink"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
