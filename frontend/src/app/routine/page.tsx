"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Loading";
import { LoadingStages } from "@/components/ui/Loading";
import { Modal } from "@/components/ui/Modal";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { RoutineCard } from "@/components/domain/RoutineCard";
import { cx } from "@/lib/cx";
import { formatFullDate } from "@/lib/format";
import { useProfile } from "@/lib/profile-context";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/storage";
import {
  generateRoutine,
  getCurrentRoutine,
  getRoutineHistory,
  makeStoredRoutine,
  pushRoutineToHistory,
  setCurrentRoutine,
} from "@/services/routine";
import type { StoredRoutine } from "@/types/routine";

type Phase = "idle" | "loading" | "error";

const buildStages = ["Reading your profile", "Building your plan", "Reviewing the result"] as const;

function keyFor(time: "morning" | "evening", step: number) {
  return `${time}-${step}`;
}

export default function RoutinePage() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  const [routine, setRoutine] = useState<StoredRoutine | null>(null);
  const [history, setHistory] = useState<StoredRoutine[]>([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"morning" | "evening">("morning");
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => {
    setRoutine(getCurrentRoutine());
    setHistory(getRoutineHistory());
    setPaused(loadJSON<boolean>(STORAGE_KEYS.routinePaused, false));
    setHidden(loadJSON<string[]>(STORAGE_KEYS.routineHidden, []));
    setReady(true);
    return clearTimers;
  }, []);

  useEffect(() => () => clearTimers(), []);

  function persistPaused(next: boolean) {
    setPaused(next);
    saveJSON(STORAGE_KEYS.routinePaused, next);
  }

  function persistHidden(next: string[]) {
    setHidden(next);
    saveJSON(STORAGE_KEYS.routineHidden, next);
  }

  function toggleHidden(time: "morning" | "evening", step: number) {
    const key = keyFor(time, step);
    if (hidden.includes(key)) {
      persistHidden(hidden.filter((item) => item !== key));
    } else {
      persistHidden([...hidden, key]);
    }
  }

  function showAll() {
    persistHidden([]);
  }

  const hasProfileFields =
    profile && (!!profile.skin_behavior || profile.concerns.length > 0);

  async function handleBuild() {
    if (!profile) return;
    try {
      const result = await generateRoutine({
        skin_behavior: profile.skin_behavior ?? "",
        concerns: profile.concerns,
      });
      const stored = makeStoredRoutine(result);
      pushRoutineToHistory(stored);
      setCurrentRoutine(stored);
      setRoutine(stored);
      setHistory(getRoutineHistory());
    } catch {
      setPhase("error");
    }
  }

  async function handleRegenerate() {
    if (!profile) return;
    clearTimers();
    setPhase("loading");
    setStageIndex(0);
    timers.current = [
      window.setTimeout(() => setStageIndex(1), 250),
      window.setTimeout(() => setStageIndex(2), 1800),
    ];
    try {
      if (routine) pushRoutineToHistory(routine);
      const result = await generateRoutine({
        skin_behavior: profile.skin_behavior ?? "",
        concerns: profile.concerns,
      });
      clearTimers();
      const stored = makeStoredRoutine(result);
      pushRoutineToHistory(stored);
      setCurrentRoutine(stored);
      setRoutine(stored);
      setHistory(getRoutineHistory());
      setPhase("idle");
      setStageIndex(0);
    } catch {
      clearTimers();
      setPhase("error");
    }
  }

  function restoreRoutine(candidate: StoredRoutine) {
    setCurrentRoutine(candidate);
    setRoutine(candidate);
    setHistoryOpen(false);
  }

  function visibleSteps(time: "morning" | "evening") {
    if (!routine) return [];
    return routine[time].filter((step) => !hidden.includes(keyFor(time, step.step)));
  }

  if (!ready || profileLoading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="mt-4 h-4 w-96 max-w-full" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <section aria-labelledby="routine-heading">
        <p className="eyebrow">Your plan</p>
        <h1 id="routine-heading" className="display mt-2 text-3xl sm:text-4xl">
          My Routine
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          A simple routine based on what you&apos;ve told SkinSense.
        </p>
      </section>

      {paused && (
        <div className="mt-6">
          <StatusBanner tone="normal" title="Routine paused — SkinSense will keep it ready." />
        </div>
      )}

      {profileError && (
        <div className="mt-6">
          <ErrorState onRetry={undefined} body="SkinSense couldn't load your profile right now." />
        </div>
      )}

      {!hasProfileFields && !profileError && (
        <div className="mt-6">
          <StatusBanner
            tone="uncertain"
            title="Not enough information about your skin yet"
            body="SkinSense needs at least your skin behavior or a concern to build a reliable routine."
          />
        </div>
      )}

      {!routine ? (
        <div className="mt-8">
          <EmptyState
            icon="○"
            title="You don't have a routine yet."
            body="Answer a few plain questions and SkinSense will build a simple morning and evening plan — with a reason for every step."
            action={
              profile
                ? { label: "Build My Routine", onClick: handleBuild }
                : undefined
            }
            secondaryAction={
              profile
                ? undefined
                : { label: "Understand My Skin First", href: "/onboarding" }
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap flex-col gap-3">
            <div
              role="tablist"
              aria-label="Routine times"
              className="flex w-full max-w-md border-2 border-line bg-surface"
            >
              {(["morning", "evening"] as const).map((time) => {
                const active = tab === time;
                return (
                  <button
                    key={time}
                    role="tab"
                    id={`tab-${time}`}
                    aria-selected={active}
                    aria-controls={`panel-${time}`}
                    onClick={() => setTab(time)}
                    className={cx(
                      "flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide",
                      active ? "bg-ink text-surface" : "text-ink-soft hover:bg-blush"
                    )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleRegenerate}
                disabled={!hasProfileFields || phase === "loading"}
              >
                Regenerate
              </Button>
              <Button
                variant="quiet"
                onClick={() => setEditing((value) => !value)}
              >
                {editing ? "Done Editing" : "Edit Routine"}
              </Button>
              <Button
                variant="quiet"
                onClick={() => persistPaused(!paused)}
              >
                {paused ? "Resume" : "Pause"}
              </Button>
              <Button variant="quiet" onClick={() => setHistoryOpen(true)}>
                View History
              </Button>
              <Link href="/ask?topic=routine" className="btn">
                Ask SkinSense
              </Link>
            </div>
          </div>

          {phase === "error" && (
            <div className="mt-6">
              <ErrorState
                body="SkinSense couldn't build a new routine right now."
                onRetry={handleRegenerate}
              />
            </div>
          )}

          {phase === "loading" && (
            <Card className="mt-6">
              <LoadingStages stages={[...buildStages]} activeIndex={stageIndex} />
            </Card>
          )}

          {phase === "idle" && (
            <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="display text-2xl">
                  {tab === "morning" ? "Morning" : "Evening"}
                </h2>
                {editing && (
                  <Button variant="quiet" onClick={showAll}>
                    Show all steps
                  </Button>
                )}
              </div>

              {hidden.length > 0 && (
                <p className="mt-3 text-sm text-ink-soft">
                  {hidden.length} step{hidden.length === 1 ? "" : "s"} hidden.
                </p>
              )}

              <div className="mt-4 space-y-4">
                {visibleSteps(tab).map((step) => (
                  <div key={keyFor(tab, step.step)} className="relative">
                    <RoutineCard step={step} />
                    {editing && (
                      <Button
                        variant="quiet"
                        size="sm"
                        className="mt-2"
                        onClick={() => toggleHidden(tab, step.step)}
                      >
                        Hide this step
                      </Button>
                    )}
                  </div>
                ))}
                {visibleSteps(tab).length === 0 && (
                  <p className="text-base text-ink-soft">
                    All {tab} steps are hidden.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <StatusBanner tone="caution" title="Safety notes">
              <ul className="mt-2 space-y-1">
                {routine.safety_notes.map((note) => (
                  <li key={note} className="flex gap-2 text-sm">
                    <span aria-hidden="true">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </StatusBanner>
          </div>

          {editing && (
            <p className="mt-4 text-sm text-ink-soft">
              Changes are saved on this device.
            </p>
          )}
        </>
      )}

      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Routine history"
      >
        {history.length === 0 ? (
          <p className="text-base text-ink-soft">
            No past routines yet. Each time you regenerate or rebuild, the previous
            routine is kept here.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((candidate) => (
              <li
                key={candidate.id}
                className="brutal brutal-shadow-sm bg-paper p-4"
              >
                <p className="text-sm font-bold uppercase tracking-wide">
                  {formatFullDate(candidate.createdAt)}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {candidate.morning.length} morning steps ·{" "}
                  {candidate.evening.length} evening steps
                </p>
                {candidate.reasons[0] && (
                  <p className="mt-2 text-sm">{candidate.reasons[0]}</p>
                )}
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => restoreRoutine(candidate)}
                  >
                    Restore
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}