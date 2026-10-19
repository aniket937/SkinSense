"use client";

import { forwardRef, useId } from "react";
import { cx } from "@/lib/cx";

type FieldLabelProps = {
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export function FieldLabel({ htmlFor, label, hint, error, required }: FieldLabelProps) {
  return (
    <span className="mb-2 block">
      <label htmlFor={htmlFor} className="block text-sm font-semibold">
        {label}
        {required && (
          <span className="ml-1 text-clay-deep" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <span id={`${htmlFor}-hint`} className="mt-0.5 block text-sm text-ink-soft">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${htmlFor}-error`} role="alert" className="mt-1 block text-sm font-semibold text-rust">
          {error}
        </span>
      )}
    </span>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy =
    error || hint ? [error ? `${inputId}-error` : null, hint ? `${inputId}-hint` : null].filter(Boolean).join(" ") : undefined;

  return (
    <span className="block">
      {label && (
        <FieldLabel htmlFor={inputId} label={label} hint={hint} error={error} required={rest.required} />
      )}
      <input
        ref={ref}
        id={inputId}
        className={cx("field", className)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </span>
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy =
    error || hint ? [error ? `${inputId}-error` : null, hint ? `${inputId}-hint` : null].filter(Boolean).join(" ") : undefined;

  return (
    <span className="block">
      {label && (
        <FieldLabel htmlFor={inputId} label={label} hint={hint} error={error} required={rest.required} />
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cx("field min-h-28", className)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </span>
  );
});
