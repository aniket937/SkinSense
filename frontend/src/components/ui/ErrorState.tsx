"use client";

import { Button } from "./Button";

type ErrorStateProps = {
  title?: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Something didn't go as planned.",
  body = "SkinSense couldn't complete that request right now.",
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <div role="alert" className="brutal brutal-shadow bg-blush p-5 sm:p-6">
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-line bg-surface font-bold"
        >
          ×
        </span>
        <div className="min-w-0">
          <h3 className="display text-lg">{title}</h3>
          <p className="mt-1 text-base text-ink-soft">{body}</p>
          {onRetry && (
            <div className="mt-4">
              <Button variant="primary" onClick={onRetry}>
                {retryLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
