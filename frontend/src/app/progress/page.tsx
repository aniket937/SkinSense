"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { formatDateLabel, formatFullDate } from "@/lib/format";
import { addEntry, listEntries, removeEntry } from "@/services/progress";
import type { JournalEntry } from "@/types/progress";

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState(false);
  const [deleting, setDeleting] = useState<JournalEntry | null>(null);

  useEffect(() => {
    setEntries(listEntries());
    setReady(true);
  }, []);

  function refresh() {
    setEntries(listEntries());
  }

  function handleAdd() {
    if (!title.trim() && !note.trim()) {
      setFormError(true);
      return;
    }
    setFormError(false);
    addEntry({ date, title: title || "Untitled note", note });
    setTitle("");
    setNote("");
    refresh();
  }

  function confirmDelete() {
    if (!deleting) return;
    removeEntry(deleting.id);
    setDeleting(null);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <section aria-labelledby="progress-heading">
        <p className="eyebrow">Your observations</p>
        <h1 id="progress-heading" className="display mt-2 text-3xl sm:text-4xl">
          Progress
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          Your notes over time — not a diagnosis.
        </p>
      </section>

      <section aria-labelledby="add-heading" className="mt-8">
        <h2 id="add-heading" className="display text-2xl">
          Add a note
        </h2>
        <div className="mt-4 space-y-4 border-2 border-line bg-surface p-5 sm:p-6 brutal-shadow">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full sm:w-48"
          />
          <Input
            label="Title"
            placeholder="Started a new serum"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Textarea
            label="Note"
            placeholder="My skin felt slightly dry."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          {formError && (
            <p role="alert" className="text-sm font-semibold text-rust">
              Add a title or a note to save an entry.
            </p>
          )}
          <Button variant="primary" onClick={handleAdd}>
            Save Note
          </Button>
        </div>
      </section>

      {ready && (
        <>
          {entries.length >= 2 && (
            <section aria-labelledby="observation-heading" className="mt-8">
              <div className="brutal brutal-shadow bg-moss p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <h2 id="observation-heading" className="display text-xl">
                    What SkinSense notices
                  </h2>
                  <Badge tone="sage">Observation from your notes</Badge>
                </div>
                <p className="mt-3 text-base text-ink-soft">
                  Here&apos;s a pattern SkinSense noticed in your notes: you&apos;ve
                  logged {entries.length} {entries.length === 1 ? "entry" : "entries"} since{" "}
                  {formatDateLabel(entries[entries.length - 1].date)}. SkinSense only
                  counts what you&apos;ve written — it doesn&apos;t draw conclusions
                  about your skin.
                </p>
              </div>
            </section>
          )}

          <section aria-labelledby="timeline-heading" className="mt-8">
            <h2 id="timeline-heading" className="display text-2xl">
              Timeline
            </h2>

            {entries.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon="○"
                  title="No notes yet"
                  body="Skincare changes take time. Jot down how your skin feels each week — your observations, kept in order."
                  action={{ label: "Add your first note", onClick: () => document.querySelector("#add-heading")?.scrollIntoView({ behavior: "smooth" }) }}
                />
              </div>
            ) : (
              <ol className="mt-6 space-y-6">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex gap-4">
                    <div className="flex w-20 shrink-0 flex-col items-center">
                      <span className="display text-lg">{formatDateLabel(entry.date)}</span>
                      <span
                        aria-hidden="true"
                        className="my-2 h-full min-h-6 w-0.5 bg-line"
                      />
                    </div>
                    <article className="brutal brutal-shadow-sm min-w-0 flex-1 bg-surface p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="display text-lg">{entry.title}</h3>
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() => setDeleting(entry)}
                        >
                          Delete
                        </Button>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
                        {formatFullDate(entry.date)}
                      </p>
                      {entry.note && (
                        <p className="mt-3 whitespace-pre-wrap text-base">
                          {entry.note}
                        </p>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete this note?"
      >
        {deleting && (
          <>
            <p className="text-base text-ink-soft">
              “{deleting.title}” from{" "}
              {formatFullDate(deleting.date)} will be removed from this device.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}