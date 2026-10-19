"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const first = panelRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea");
    first?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx("brutal brutal-shadow-lg w-full max-w-lg bg-surface p-5 sm:p-6", className)}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="display text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-line bg-surface text-lg font-bold"
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
