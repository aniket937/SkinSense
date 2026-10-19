"use client";

import Link from "next/link";
import { Card } from "./Card";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateProps = {
  icon?: string;
  title: string;
  body?: string;
  action?: Action;
  secondaryAction?: Action;
};

function ActionButton({ action, variant }: { action: Action; variant: "primary" | "secondary" }) {
  const className = `btn ${variant === "primary" ? "btn-primary" : ""}`;
  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={action.onClick}>
      {action.label}
    </button>
  );
}

export function EmptyState({ icon = "○", title, body, action, secondaryAction }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center border-2 border-line bg-paper text-xl"
      >
        {icon}
      </span>
      <h3 className="display mt-4 text-xl">{title}</h3>
      {body && <p className="mx-auto mt-2 max-w-md text-base text-ink-soft">{body}</p>}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action && <ActionButton action={action} variant="primary" />}
          {secondaryAction && <ActionButton action={secondaryAction} variant="secondary" />}
        </div>
      )}
    </Card>
  );
}
