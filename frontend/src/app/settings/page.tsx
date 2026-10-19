"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { titleCase } from "@/lib/format";
import { useProfile } from "@/lib/profile-context";
import { STORAGE_KEYS, clearAllSkinSenseData, loadJSON, saveJSON } from "@/lib/storage";
import { getHealth, type HealthResponse } from "@/services/api";

type Preferences = {
  routinePrefs?: string[];
  language?: string;
  voiceOutput?: boolean;
  sttLanguage?: string;
};

const routinePrefOptions = ["quick routine", "minimal steps", "gentle actives", "budget-friendly"];
const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "mr", label: "मराठी" },
];
const sttOptions = [
  { value: "en-IN", label: "English (India)" },
  { value: "hi-IN", label: "हिन्दी (भारत)" },
  { value: "mr-IN", label: "मराठी (भारत)" },
];

export default function SettingsPage() {
  const { profile } = useProfile();
  const [prefs, setPrefs] = useState<Preferences>({});
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [understand, setUnderstand] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const deleteToggleId = useId();

  useEffect(() => {
    setPrefs(loadJSON<Preferences>(STORAGE_KEYS.prefs, {}));
    getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  function commitPrefs(patch: Partial<Preferences>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    saveJSON(STORAGE_KEYS.prefs, next);
  }

  function toggleRoutinePref(value: string) {
    const current = prefs.routinePrefs ?? [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    commitPrefs({ routinePrefs: next });
  }

  function previewVoice() {
    if (!("speechSynthesis" in window)) return;
    const allowed = prefs.sttLanguage ?? "en-IN";
    const utterance = new SpeechSynthesisUtterance(
      "Hello from SkinSense. This is your device's built-in voice."
    );
    utterance.lang = allowed.startsWith("hi") ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
  }

  function handleDelete() {
    clearAllSkinSenseData();
    setDeleteOpen(false);
    setUnderstand(false);
    setPrefs({});
    setDeleted(true);
  }

  const profileInfo = profile
    ? [
        profile.skin_behavior ? `Skin: ${titleCase(profile.skin_behavior)}` : null,
        profile.sensitivity ? `Sensitivity: ${titleCase(profile.sensitivity)}` : null,
        profile.concerns.length > 0 ? `Concerns: ${profile.concerns.join(", ")}` : null,
        profile.current_products.length > 0
          ? `Products: ${profile.current_products.length} listed`
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <section aria-labelledby="settings-heading">
        <p className="eyebrow">Settings</p>
        <h1 id="settings-heading" className="display mt-2 text-3xl sm:text-4xl">
          Settings
        </h1>
        <nav aria-label="Settings sections" className="mt-4 flex flex-wrap gap-2">
          {[
            ["#profile", "Profile"],
            ["#preferences", "Preferences"],
            ["#privacy", "Privacy"],
            ["#data", "Data"],
            ["#about", "About"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={`/settings${href}`}
              className="border-2 border-line bg-surface px-3 py-1.5 text-sm font-semibold"
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>

      {deleted && (
        <div className="mt-6">
          <StatusBanner tone="normal" title="Local data deleted." />
        </div>
      )}

      <div className="mt-8 space-y-6">
        <Card as="section" id="profile" aria-labelledby="profile-heading">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Your profile</p>
              <h2 id="profile-heading" className="display mt-1 text-2xl">
                Profile
              </h2>
            </div>
            <Link href="/skin" className="btn btn-sm">
              Edit
            </Link>
          </div>
          <p className="mt-3 text-base text-ink-soft">
            {profileInfo ??
              "You haven't shared your skin context yet. Answer a few plain questions to start from your own skin."}
          </p>
        </Card>

        <Card as="section" id="preferences" aria-labelledby="preferences-heading">
          <p className="eyebrow">Preferences</p>
          <h2 id="preferences-heading" className="display mt-1 text-2xl">
            Preferences
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            Routine style preferences. Saved on this device only, and used to
            shape the routine you build.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Routine preferences">
            {routinePrefOptions.map((option) => {
              const selected = (prefs.routinePrefs ?? []).includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleRoutinePref(option)}
                  className={`border-2 border-line px-3 py-2 text-sm font-semibold ${
                    selected ? "bg-ink text-surface" : "bg-surface hover:bg-blush"
                  }`}
                >
                  {titleCase(option)}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="language-select"
                className="mb-2 block text-sm font-semibold"
              >
                Language
              </label>
              <select
                id="language-select"
                className="field"
                value={prefs.language ?? "en"}
                onChange={(event) => commitPrefs({ language: event.target.value })}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-ink-soft">
                Interface language preference is saved on this device.
                SkinSense&apos;s answers are currently in English.
              </p>
            </div>

            <div>
              <label
                htmlFor="voice-output-toggle"
                className="mb-2 flex cursor-pointer items-center justify-between gap-4 border-2 border-line bg-paper p-3"
              >
                <span className="text-sm font-semibold">Voice output</span>
                <input
                  id="voice-output-toggle"
                  type="checkbox"
                  className="h-6 w-6 shrink-0 accent-clay-deep"
                  checked={prefs.voiceOutput ?? false}
                  onChange={(event) =>
                    commitPrefs({ voiceOutput: event.target.checked })
                  }
                />
              </label>
              <div className="mt-3">
                <label
                  htmlFor="stt-select"
                  className="mb-2 block text-sm font-semibold"
                >
                  Listening language
                </label>
                <select
                  id="stt-select"
                  className="field"
                  value={prefs.sttLanguage ?? "en-IN"}
                  onChange={(event) =>
                    commitPrefs({ sttLanguage: event.target.value })
                  }
                >
                  {sttOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Voice output uses your device&apos;s built-in voice — no external
                service.
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={previewVoice}>
                Test voice
              </Button>
            </div>
          </div>
        </Card>

        <Card as="section" id="privacy" aria-labelledby="privacy-heading">
          <p className="eyebrow">Privacy</p>
          <h2 id="privacy-heading" className="display mt-1 text-2xl">
            Privacy
          </h2>
          <div className="mt-4 space-y-4 text-base">
            <div>
              <p className="font-semibold">What SkinSense stores</p>
              <p className="mt-1 text-ink-soft">
                The profile fields you entered (skin behavior, sensitivity, concerns,
                current products), kept on the backend as a single profile. Routine
                history and journal entries live on this device only.
              </p>
            </div>
            <div>
              <p className="font-semibold">Product photos</p>
              <p className="mt-1 text-ink-soft">
                The label-reading service isn&apos;t connected in this build, so photos
                aren&apos;t uploaded anywhere.
              </p>
            </div>
            <div>
              <p className="font-semibold">Voice</p>
              <p className="mt-1 text-ink-soft">
                Voice input is transcribed by your browser&apos;s built-in speech
                service. SkinSense doesn&apos;t store audio.
              </p>
            </div>
            <div>
              <p className="font-semibold">Conversations</p>
              <p className="mt-1 text-ink-soft">
                Ask history lives in this tab only and clears when you close it.
              </p>
            </div>
          </div>
        </Card>

        <Card as="section" id="data" aria-labelledby="data-heading">
          <p className="eyebrow">Your data</p>
          <h2 id="data-heading" className="display mt-1 text-2xl">
            Data
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            Delete your local SkinSense data — routine history, journal, preferences,
            onboarding notes, and this tab&apos;s chat.
          </p>
          <div className="mt-4">
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              Delete your SkinSense data
            </Button>
          </div>
        </Card>

        <Card as="section" id="about" aria-labelledby="about-heading">
          <p className="eyebrow">About</p>
          <h2 id="about-heading" className="display mt-1 text-2xl">
            About SkinSense
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            SkinSense is an educational decision-support companion. It is not a
            dermatologist, not a diagnosis tool, not a store.
          </p>
          <p className="mt-3 text-base text-ink-soft">
            {health
              ? `${health.service} v${health.version} · Backend connected`
              : "Backend not reachable right now"}
          </p>
        </Card>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete your SkinSense data?"
      >
        <ul className="space-y-2 text-base">
          {[
            "Routine history on this device",
            "Journal entries on this device",
            "Preferences saved on this device",
            "Onboarding notes on this device",
            "This tab's chat",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-base text-ink-soft">
          Your saved profile on the server (skin type, concerns, products) can&apos;t
          be deleted from this screen yet — it was created as a single default
          profile.
        </p>
        <label
          htmlFor={deleteToggleId}
          className="mt-5 flex cursor-pointer items-center gap-3 border-2 border-line bg-paper p-3"
        >
          <input
            id={deleteToggleId}
            type="checkbox"
            className="h-6 w-6 shrink-0 accent-clay-deep"
            checked={understand}
            onChange={(event) => setUnderstand(event.target.checked)}
          />
          <span className="text-sm font-semibold">
            I understand this can&apos;t be undone
          </span>
        </label>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={!understand}>
            Delete data
          </Button>
        </div>
      </Modal>
    </div>
  );
}