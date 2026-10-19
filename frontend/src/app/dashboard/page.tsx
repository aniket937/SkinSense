"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Loading";
import { useProfile } from "@/lib/profile-context";
import { getCurrentRoutine } from "@/services/routine";
import { getHealth, type HealthResponse } from "@/services/api";
import { greetingForNow, titleCase } from "@/lib/format";
import type { StoredRoutine } from "@/types/routine";
import { listEntries } from "@/services/progress";
import { saveJSON, loadJSON, STORAGE_KEYS } from "@/lib/storage";

function SkinContextCard() {
  const { profile, loading, error, refresh } = useProfile();

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </Card>
    );
  }

  if (error) {
    return <ErrorState onRetry={refresh} />;
  }

  const empty =
    !profile ||
    (!profile.skin_behavior && !profile.sensitivity && profile.concerns.length === 0);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Your skin context</p>
          <h2 className="display mt-1 text-2xl">What SkinSense knows about you</h2>
        </div>
        <Link href="/skin" className="btn btn-sm">
          Edit
        </Link>
      </div>

      {empty ? (
        <div className="mt-4">
          <EmptyState
            title="No profile yet"
            body="Answer a few plain questions so SkinSense can work with your context instead of generic advice."
            action={{ label: "Understand My Skin", href: "/onboarding" }}
          />
        </div>
      ) : (
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="eyebrow">Skin behavior</dt>
            <dd className="mt-1 text-base font-semibold">
              {profile?.skin_behavior ? titleCase(profile.skin_behavior) : "Not set"}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Sensitivity</dt>
            <dd className="mt-1 text-base font-semibold">
              {profile?.sensitivity ? titleCase(profile.sensitivity) : "Not set"}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Products on hand</dt>
            <dd className="mt-1 text-base font-semibold">
              {profile?.current_products.length
                ? `${profile.current_products.length} listed`
                : "None listed"}
            </dd>
          </div>
          <div className="sm:col-span-3">
            <dt className="eyebrow">Concerns</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {profile && profile.concerns.length > 0 ? (
                profile.concerns.map((concern) => (
                  <Badge key={concern} tone="muted">
                    {concern}
                  </Badge>
                ))
              ) : (
                <span className="text-base text-ink-soft">No concerns recorded</span>
              )}
            </dd>
          </div>
        </dl>
      )}
    </Card>
  );
}

function RoutineCardSummary() {
  const [routine, setRoutine] = useState<StoredRoutine | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRoutine(getCurrentRoutine());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <Card>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-4 w-full" />
      </Card>
    );
  }

  return (
    <Card tone="moss">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Today's routine</p>
          <h2 className="display mt-1 text-2xl">
            {routine ? "Your morning & evening" : "No routine yet"}
          </h2>
        </div>
        <Link href="/routine" className="btn btn-sm">
          {routine ? "View Routine" : "Open"}
        </Link>
      </div>
      {routine ? (
        <div className="mt-4 space-y-2">
          {[...routine.morning.slice(0, 2), ...routine.evening.slice(0, 2)].map(
            (step, index) => (
              <p key={`${step.step}-${index}`} className="text-base">
                <span className="font-semibold">{titleCase(step.category)}</span>
                <span className="text-ink-soft"> — {step.purpose}</span>
              </p>
            )
          )}
        </div>
      ) : (
        <p className="mt-3 text-base text-ink-soft">
          Build a simple routine based on what you've told SkinSense — with a reason
          for every step.
        </p>
      )}
      <div className="mt-5">
        <Link href="/routine" className="btn btn-primary">
          {routine ? "View My Routine" : "Build My Routine"}
        </Link>
      </div>
    </Card>
  );
}

// ----- Workspace selector (persisted in localStorage) -----
const STORAGE_KEY_SELECTED_CLIENT = "selectedClient";

function useSelectedClient() {
  const [clientId, setClientId] = useState(() => {
    const saved = loadJSON<string | null>(STORAGE_KEY_SELECTED_CLIENT, null);
    return saved ?? "demo-1";
  });
  const setClientIdStorage = (id: string) => {
    setClientId(id);
    saveJSON(STORAGE_KEY_SELECTED_CLIENT, id);
  };
  return { clientId, setClientIdStorage };
}

const demoClients = {
  "demo-1": {
    skinBehavior: "combination",
    sensitivity: "sometimes",
    concerns: ["hyper‑pigmentation", "dryness"],
    products: ["CeraVe Moisturizer"],
  },
  "demo-2": {
    skinBehavior: "oiliness",
    sensitivity: "moderate",
    concerns: ["acne", "enlarged pores"],
    products: ["Paula's Choice Cleanser", "The Ordinary Niacinamide 10%"],
  },
};

// ----- Primary actions -----
const primaryActions = [
  { label: "Open Client Workspace", href: "/consultation", primary: true },
  { label: "Start Consultation", href: "/consultation", primary: false },
  { label: "Check a Product", href: "/check-product", primary: false },
  { label: "Explain an Ingredient", href: "/ask?topic=routine", primary: false },
  { label: "Generate Routine", href: "/routine", primary: false },
  { label: "Create Client Report", href: "/report", primary: true },
];

export default function DashboardPage() {
  const { profile, loading, error, refresh } = useProfile();
  const { clientId, setClientIdStorage } = useSelectedClient();
  const demo = demoClients[clientId];
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [journalCount, setJournalCount] = useState(0);

  // Sync profile with selected demo client when client changes
  useEffect(() => {
    if (clientId.startsWith("demo")) {
      const data = demoClients[clientId];
      if (data) {
        const profileData = {
          skin_behavior: data.skinBehavior,
          sensitivity: data.sensitivity,
          concerns: data.concerns,
          current_products: data.products,
        };
        // Store as the default profile so the rest of the app sees it
        saveJSON(STORAGE_KEYS.profile, profileData);
      }
    }
  }, [clientId]);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
    setJournalCount(listEntries().length);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <section aria-labelledby="dashboard-heading">
        <p className="eyebrow">Your skincare home</p>
        <h1 id="dashboard-heading" className="display mt-2 text-3xl sm:text-4xl">
          {greetingForNow()}
        </h1>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">
          Let's make today's skincare decisions a little simpler.
        </p>
      </section>

      {/* ---- Workspace selector ---- */}
      <div className="mt-4 flex flex-wrap gap-2" role="region" aria-label="Workspace selector">
        <Button
          variant={clientId.startsWith("demo") ? "secondary" : "primary"}
          size="sm"
          onClick={() => setClientIdStorage("demo-1")}
        >
          Demo Client 1
        </Button>
        <Button
          variant={clientId === "demo-2" ? "secondary" : "primary"}
          size="sm"
          onClick={() => setClientIdStorage("demo-2")}
        >
          Demo Client 2
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setClientIdStorage("new")}
        >
          New Client
        </Button>
      </div>

      {/* ---- Primary action bar ---- */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Primary actions">
  {/* Primary action buttons */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Primary actions">
          <Link href="/consultation" className="btn btn-primary mr-2 mb-2">Open Client Workspace</Link>
          <Link href="/consultation" className="btn btn-secondary mb-3">Start Consultation</Link>
          <Link href="/check-product" className="btn btn-secondary mb-3">Check a Product</Link>
          <Link href="/ask?topic=routine" className="btn btn-secondary mb-3">Explain an Ingredient</Link>
          <Link href="/routine" className="btn btn-secondary mb-3">Generate Routine</Link>
          <Link href="/report" className="btn btn-primary">Create Client Report</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkinContextCard />
        </div>
        <div className="lg:col-span-1">
          <RoutineCardSummary />
        </div>

        <Card tone="blush" className="lg:col-span-2">
          <p className="eyebrow">Main action</p>
          <h2 className="display mt-1 text-2xl">Check a product</h2>
          <p className="mt-2 text-base text-ink-soft">
            Understand what's in it and how it fits with what you already use — before
            it joins your shelf.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/check-product" className="btn btn-primary">
              Check a Product
            </Link>
            <Link href="/ingredients" className="btn">
              Explore Ingredients
            </Link>
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Learn as you go</p>
          <h2 className="display mt-1 text-xl">Ingredients, explained simply</h2>
          <p className="mt-2 text-base text-ink-soft">
            Search skincare terms and read what they actually do.
          </p>
          <div className="mt-5">
            <Link href="/ingredients" className="btn">
              Open Ingredient Explorer
            </Link>
          </div>
        </Card>

        <Card tone="moss">
          <p className="eyebrow">Prefer speaking?</p>
          <h2 className="display mt-1 text-xl">Ask SkinSense by voice</h2>
          <p className="mt-2 text-base text-ink-soft">
            Ask naturally — "Will this serum work with my routine?" — and get the same
            reasoned answer.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/ask?voice=1" className="btn btn-primary">
              Ask by Voice
            </Link>
            <Link href="/ask" className="btn">
              Ask SkinSense
            </Link>
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Progress</p>
          <h2 className="display mt-1 text-xl">
            {journalCount > 0
              ? `${journalCount} journal ${journalCount === 1 ? "entry" : "entries"}`
              : "Your progress journal"}
          </h2>
          <p className="mt-2 text-base text-ink-soft">
            Note how your skin feels over time — your observations, not a diagnosis.
          </p>
          <div className="mt-5">
            <Link href="/progress" className="btn">
              Open Journal
            </Link>
          </div>
        </Card>
      </div>

      <footer className="mt-10 flex items-center gap-3 text-xs text-ink-soft">
        <span
          aria-hidden="true"
          className={`inline-block h-2.5 w-2.5 border-2 border-line ${
            health ? "bg-sage" : "bg-honey"
          }`}
        />
        <span>
          {health
            ? `Backend connected · ${health.service} v${health.version}`
            : "Backend not reachable right now"}
        </span>
      </footer>
    </div>
  );
}