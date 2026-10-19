"use client";

import { forwardRef } from "react";
import { cx } from "@/lib/cx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variantClass = {
  primary: "btn-primary",
  secondary: "",
  quiet: "btn-quiet",
  danger: "btn-danger",
} as const;

const sizeClass = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cx("btn", variantClass[variant], sizeClass[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
});
