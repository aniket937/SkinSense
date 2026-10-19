"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FieldLabel } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Loading";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { titleCase } from "@/lib/format";
import { useProfile } from "@/lib/profile-context";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/storage";
import type { UserProfile } from "@/types/user-profile";
import {
  concernOptions,
  sensitivityOptions,
  skinFeelOptions,
} from "../onboarding/config";
import { useLocalJSON } from "./local-store";
import { ChipEditor, SectionCard } from "./sections";

type SaveInput = {
  skin_behavior?: string;
  sensitivity?: string;
  concerns?: string[];
  current_products?: string[];
};

type SkinSensePrefs = {
  language?: string;
  voiceOutput?: boolean;
  sttLanguage?: string;
};

const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "mr", label: "मराठी" },
];

const listeningLanguageOptions = [
  { value: "en-IN", label: "English" },
  { value: "hi-IN", label: "हिन्दी" },
  { value: "mr-IN", label: "मराठी" },
];

const notSet = <span className="font-normal text-ink-soft">Not set</span>;

function buildFullState(profile: UserProfile, patch: SaveInput): SaveInput {
  const skin =
    "skin_behavior" in patch ? patch.skin_behavior : profile.skin_behavior;
  const sensitivity =
    "sensitivity" in patch ? patch.sensitivity : profile.sensitivity;
  const input: SaveInput = {};
  if (skin) input.skin_behavior = skin;
  if (sensitivity) input.sensitivity = sensitivity;
  input.concerns = patch.concerns ?? profile.concerns ?? [];
  input.current_products =
    patch.current_products ?? profile.current_products ?? [];
  return input;
}

function useSectionEdit(onSaved: () => void, onEditingStart: () => void) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  function startEdit() {
    setSaved(false);
    setSaveError(false);
    setEditing(true);
    onEditingStart();
  }

  function cancel() {
    setSaveError(false);
    setEditing(false);
  }

  async function commit(run: () => void | Promise<unknown>) {
    setSaving(true);
    setSaveError(false);
    try {
      await run();
      setSaved(true);
      setEditing(false);
      onSaved();
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  return { editing, saved, saving, saveError, startEdit, cancel, commit };
}

type ProfileSectionProps = {
  profile: UserProfile;
  onSaved: () => void;
  onEditingStart: () => void;
};

function SkinSection({ profile, onSaved, onEditingStart }: ProfileSectionProps) {
  const { save } = useProfile();
  const edit = useSectionEdit(onSaved, onEditingStart);
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <SectionCard
      title="My Skin"
      editing={edit.editing}
      saved={edit.saved}
      saving={edit.saving}
      saveError={edit.saveError}
      value={profile.skin_behavior ? titleCase(profile.skin_behavior) : notSet}
      onEdit={() => {
        setDraft(profile.skin_behavior);
        edit.startEdit();
      }}
      onCancel={edit.cancel}
      onSave={() =>
        edit.commit(() =>
          save(buildFullState(profile, { skin_behavior: draft ?? undefined }))
        )
      }
    >
      <div className="grid gap-3">
        {skinFeelOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={draft === option.value}
            onSelect={() => setDraft(option.value)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function ConcernsSection({
  profile,
  onSaved,
  onEditingStart,
}: ProfileSectionProps) {
  const { save } = useProfile();
  const edit = useSectionEdit(onSaved, onEditingStart);
  const [draft, setDraft] = useState<string[]>([]);

  return (
    <SectionCard
      title="My Concerns"
      editing={edit.editing}
      saved={edit.saved}
      saving={edit.saving}
      saveError={edit.saveError}
      value={
        profile.concerns.length > 0 ? (
          <span className="flex flex-wrap gap-2">
            {profile.concerns.map((concern) => (
              <Badge key={concern} tone="muted">
                {concern}
              </Badge>
            ))}
          </span>
        ) : (
          notSet
        )
      }
      onEdit={() => {
        setDraft([...profile.concerns]);
        edit.startEdit();
      }}
      onCancel={edit.cancel}
      onSave={() =>
        edit.commit(() => save(buildFullState(profile, { concerns: draft })))
      }
    >
      <ChipEditor
        label="Add a concern"
        hint="Press Enter or comma after each concern."
        placeholder="e.g. dark spots"
        values={draft}
        onChange={setDraft}
        options={concernOptions}
        optionsLabel="Quick picks"
      />
    </SectionCard>
  );
}

function SensitivitySection({
  profile,
  onSaved,
  onEditingStart,
}: ProfileSectionProps) {
  const { save } = useProfile();
  const edit = useSectionEdit(onSaved, onEditingStart);
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <SectionCard
      title="Sensitivity"
      editing={edit.editing}
      saved={edit.saved}
      saving={edit.saving}
      saveError={edit.saveError}
      value={profile.sensitivity ? titleCase(profile.sensitivity) : notSet}
      onEdit={() => {
        setDraft(profile.sensitivity);
        edit.startEdit();
      }}
      onCancel={edit.cancel}
      onSave={() =>
        edit.commit(() =>
          save(buildFullState(profile, { sensitivity: draft ?? undefined }))
        )
      }
    >
      <div className="grid gap-3">
        {sensitivityOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={draft === option.value}
            onSelect={() => setDraft(option.value)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function ProductsSection({
  profile,
  onSaved,
  onEditingStart,
}: ProfileSectionProps) {
  const { save } = useProfile();
  const edit = useSectionEdit(onSaved, onEditingStart);
  const [draft, setDraft] = useState<string[]>([]);

  return (
    <SectionCard
      title="My Products"
      editing={edit.editing}
      saved={edit.saved}
      saving={edit.saving}
      saveError={edit.saveError}
      value={
        profile.current_products.length > 0 ? (
          <span className="flex flex-wrap gap-2">
            {profile.current_products.map((product) => (
              <span
                key={product}
                className="brutal brutal-shadow-sm bg-surface px-3 py-1 text-sm font-semibold"
              >
                {product}
              </span>
            ))}
          </span>
        ) : (
          notSet
        )
      }
      onEdit={() => {
        setDraft([...profile.current_products]);
        edit.startEdit();
      }}
      onCancel={edit.cancel}
      onSave={() =>
        edit.commit(() =>
          save(buildFullState(profile, { current_products: draft }))
        )
      }
    >
      <ChipEditor
        label="Add a product"
        hint="Press Enter or comma after each product."
        placeholder="e.g. gentle cleanser"
        values={draft}
        onChange={setDraft}
      />
    </SectionCard>
  );
}

type PrefsSectionProps = {
  prefs: SkinSensePrefs;
  commit: (patch: SkinSensePrefs) => void;
  onSaved: () => void;
  onEditingStart: () => void;
};

function LanguageSection({
  prefs,
  commit,
  onSaved,
  onEditingStart,
}: PrefsSectionProps) {
  const edit = useSectionEdit(onSaved, onEditingStart);
  const [draft, setDraft] = useState("en");
  const selectId = useId();

  const label =
    languageOptions.find((option) => option.value === prefs.language)?.label ??
    notSet;

  return (
    <SectionCard
      title="Language"
      editing={edit.editing}
      saved={edit.saved}
      saving={edit.saving}
      saveError={edit.saveError}
      value={label}
      footnote="Saved on this device only."
      onEdit={() => {
        setDraft(
          languageOptions.find((option) => option.value === prefs.language)
            ?.value ?? "en"
        );
        edit.startEdit();
      }}
      onCancel={edit.cancel}
      onSave={() => edit.commit(() => commit({ language: draft }))}
    >
      <FieldLabel
        htmlFor={selectId}
        label="Language"
        hint="Used across SkinSense on this device."
      />
      <select
        id={selectId}
        className="field"
        aria-describedby={`${selectId}-hint`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SectionCard>
  );
}

function VoiceSection({
  prefs,
  commit,
  onSaved,
  onEditingStart,
}: PrefsSectionProps) {
  const edit = useSectionEdit(onSaved, onEditingStart);
  const [draftOutput, setDraftOutput] = useState(false);
  const [draftStt, setDraftStt] = useState("en-IN");
  const toggleId = useId();
  const selectId = useId();

  const listeningLabel =
    listeningLanguageOptions.find(
      (option) => option.value === (prefs.sttLanguage ?? "en-IN")
    )?.label ?? "English";

  return (
    <SectionCard
      title="Voice"
      editing={edit.editing}
      saved={edit.saved}
      saving={edit.saving}
      saveError={edit.saveError}
      value={
        prefs.voiceOutput === undefined ? (
          notSet
        ) : (
          <>
            Voice output: {prefs.voiceOutput ? "On" : "Off"} · Listening
            language: {listeningLabel}
          </>
        )
      }
      footnote="Saved on this device only."
      onEdit={() => {
        setDraftOutput(prefs.voiceOutput ?? false);
        setDraftStt(
          listeningLanguageOptions.find(
            (option) => option.value === prefs.sttLanguage
          )?.value ?? "en-IN"
        );
        edit.startEdit();
      }}
      onCancel={edit.cancel}
      onSave={() =>
        edit.commit(() =>
          commit({ voiceOutput: draftOutput, sttLanguage: draftStt })
        )
      }
    >
      <label
        htmlFor={toggleId}
        className="flex cursor-pointer items-center justify-between gap-4 border-2 border-line bg-paper p-3"
      >
        <span className="text-sm font-semibold">Voice output</span>
        <input
          id={toggleId}
          type="checkbox"
          className="h-6 w-6 shrink-0 accent-clay-deep"
          checked={draftOutput}
          onChange={(event) => setDraftOutput(event.target.checked)}
        />
      </label>
      <p className="mt-2 text-sm text-ink-soft">
        Answers are read aloud with your device&apos;s built-in voice — no
        external service.
      </p>
      <div className="mt-4">
        <FieldLabel
          htmlFor={selectId}
          label="Listening language"
          hint="The language SkinSense listens for when you speak a question."
        />
        <select
          id={selectId}
          className="field"
          aria-describedby={`${selectId}-hint`}
          value={draftStt}
          onChange={(event) => setDraftStt(event.target.value)}
        >
          {listeningLanguageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </SectionCard>
  );
}

function LinkCard({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <Card as="section">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="display text-2xl">{title}</h2>
          <p className="mt-2 text-base text-ink-soft">{body}</p>
        </div>
        <Link href={href} className="btn shrink-0">
          {action}
        </Link>
      </div>
    </Card>
  );
}

export default function SkinPage() {
  const { profile, loading, error, refresh } = useProfile();
  const [banner, setBanner] = useState(false);
  const notes = useLocalJSON<string>(STORAGE_KEYS.onboardingNotes, "");
  const prefs = useLocalJSON<SkinSensePrefs>(STORAGE_KEYS.prefs, {});

  function handleSaved() {
    setBanner(true);
  }

  function handleEditingStart() {
    setBanner(false);
  }

  function commitPrefs(patch: SkinSensePrefs) {
    const current = loadJSON<SkinSensePrefs>(STORAGE_KEYS.prefs, {});
    saveJSON(STORAGE_KEYS.prefs, { ...current, ...patch });
  }

  const profileEmpty = profile
    ? !profile.skin_behavior &&
      !profile.sensitivity &&
      profile.concerns.length === 0 &&
      profile.current_products.length === 0
    : false;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <section aria-labelledby="skin-page-heading">
        <p className="eyebrow">Your profile</p>
        <h1 id="skin-page-heading" className="display mt-2 text-3xl sm:text-4xl">
          My Skin
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          What SkinSense knows about you. Update anything that has changed.
        </p>
      </section>

      {banner && (
        <div className="mt-6">
          <StatusBanner tone="normal" title="Changes saved" />
        </div>
      )}

      {loading && (
        <div className="mt-6 space-y-5">
          <Card>
            <Skeleton className="h-6 w-44" />
            <Skeleton className="mt-4 h-4 w-3/4" />
            <Skeleton className="mt-3 h-4 w-1/2" />
          </Card>
          <Card>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="mt-4 h-4 w-2/3" />
          </Card>
        </div>
      )}

      {!loading && (error || !profile) && (
        <div className="mt-6">
          <ErrorState onRetry={refresh} />
        </div>
      )}

      {!loading && !error && profile && (
        <div className="mt-6 space-y-5">
          {profileEmpty ? (
            <EmptyState
              title="No skin profile yet"
              body="Answer a few plain questions so SkinSense can work with your context instead of generic advice."
              action={{ label: "Understand your skin first", href: "/onboarding" }}
            />
          ) : (
            <>
              <SkinSection
                profile={profile}
                onSaved={handleSaved}
                onEditingStart={handleEditingStart}
              />
              <ConcernsSection
                profile={profile}
                onSaved={handleSaved}
                onEditingStart={handleEditingStart}
              />
              <SensitivitySection
                profile={profile}
                onSaved={handleSaved}
                onEditingStart={handleEditingStart}
              />
              <ProductsSection
                profile={profile}
                onSaved={handleSaved}
                onEditingStart={handleEditingStart}
              />
            </>
          )}

          {notes.trim().length > 0 && (
            <Card>
              <h2 className="display text-2xl">Notes from your onboarding</h2>
              <p className="mt-3 whitespace-pre-wrap text-base text-ink-soft">
                {notes}
              </p>
              <p className="mt-3 text-sm text-ink-soft">
                Saved on this device only.
              </p>
            </Card>
          )}

          <LinkCard
            title="My Routine"
            body="Your morning and evening steps, each with a reason."
            href="/routine"
            action="Open routine"
          />

          <LanguageSection
            prefs={prefs}
            commit={commitPrefs}
            onSaved={handleSaved}
            onEditingStart={handleEditingStart}
          />
          <VoiceSection
            prefs={prefs}
            commit={commitPrefs}
            onSaved={handleSaved}
            onEditingStart={handleEditingStart}
          />

          <LinkCard
            title="Privacy"
            body="Choose what SkinSense remembers."
            href="/settings#privacy"
            action="Privacy settings"
          />
          <LinkCard
            title="Data"
            body="See what is stored on this device."
            href="/settings#data"
            action="Data settings"
          />
        </div>
      )}
    </div>
  );
}
