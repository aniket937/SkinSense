import type { JournalEntry } from "@/types/progress";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/storage";
import { uid } from "@/lib/format";

export function listEntries(): JournalEntry[] {
  const entries = loadJSON<JournalEntry[]>(STORAGE_KEYS.journal, []);
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function addEntry(input: { date: string; title: string; note: string }): JournalEntry {
  const entry: JournalEntry = {
    id: uid(),
    date: input.date,
    title: input.title.trim(),
    note: input.note.trim(),
  };
  const entries = loadJSON<JournalEntry[]>(STORAGE_KEYS.journal, []);
  saveJSON(STORAGE_KEYS.journal, [entry, ...entries]);
  return entry;
}

export function removeEntry(id: string): void {
  const entries = loadJSON<JournalEntry[]>(STORAGE_KEYS.journal, []);
  saveJSON(
    STORAGE_KEYS.journal,
    entries.filter((entry) => entry.id !== id)
  );
}
