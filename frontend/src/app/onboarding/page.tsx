"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingStages } from "@/components/ui/Loading";
import { useProfile } from "@/lib/profile-context";
import { STORAGE_KEYS, saveJSON } from "@/lib/storage";
import {
  generateRoutine,
  makeStoredRoutine,
  pushRoutineToHistory,
  setCurrentRoutine,
} from "@/services/routine";
import {
  buildStages,
  initialAnswers,
  type Answers,
  type QuestionIndex,
} from "./config";
import {
  ConcernsStep,
  NotesStep,
  PrefsStep,
  ProductsStep,
  SensitivityStep,
  SkinFeelStep,
} from "./questions";
import { ReviewScreen } from "./review";

type Step =
  | "welcome"
  | "why"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "review"
  | "done";

const forwardSteps = ["q1", "q2", "q3", "q4", "q5", "q6", "review"] as const;
const backwardSteps = ["welcome", "why", "q1", "q2", "q3", "q4", "q5"] as const;

const reasons = [
  {
    number: "01",
    title: "Understand your context",
    body: "A few plain questions, so everything starts from your skin instead of generic advice.",
    tone: "bg-blush",
  },
  {
    number: "02",
    title: "A routine that explains itself",
    body: "Morning and evening steps, each with a short reason it is there.",
    tone: "bg-moss",
  },
  {
    number: "03",
    title: "Check products before buying",
    body: "See how a product fits with your routine before it joins your shelf.",
    tone: "bg-honey",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { save } = useProfile();

  const [step, setStep] = useState<Step>("welcome");
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [productDraft, setProductDraft] = useState("");
  const [editReturn, setEditReturn] = useState<QuestionIndex | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [buildPhase, setBuildPhase] = useState<"idle" | "loading" | "error">("idle");
  const [stageIndex, setStageIndex] = useState(0);

  const stepRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => {
    stepRef.current?.focus();
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => clearTimers, []);

  function updateAnswer<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function goNextFromQuestion(current: QuestionIndex) {
    if (editReturn === current) {
      setEditReturn(null);
      setStep("review");
      return;
    }
    setStep(forwardSteps[current]);
  }

  function goBackFromQuestion(current: QuestionIndex) {
    setEditReturn(null);
    setStep(backwardSteps[current]);
  }

  async function handleConfirm() {
    setSaving(true);
    setSaveError(false);
    try {
      const input: {
        skin_behavior?: string;
        sensitivity?: string;
        concerns?: string[];
        current_products?: string[];
      } = {};
      if (answers.skinBehavior) input.skin_behavior = answers.skinBehavior;
      if (answers.sensitivity) input.sensitivity = answers.sensitivity;
      if (answers.concerns.length) input.concerns = answers.concerns;
      if (answers.products.length) input.current_products = answers.products;
      await save(input);
      saveJSON(STORAGE_KEYS.onboardingPrefs, answers.prefs);
      saveJSON(STORAGE_KEYS.onboardingNotes, answers.notes);
      setEditReturn(null);
      setStep("done");
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleBuild() {
    clearTimers();
    setBuildPhase("loading");
    setStageIndex(0);
    let failed = false;

    const fail = () => {
      if (failed) return;
      failed = true;
      clearTimers();
      setBuildPhase("error");
    };

    timers.current.push(window.setTimeout(fail, 12000));
    timers.current.push(window.setTimeout(() => setStageIndex(1), 300));

    try {
      const result = await generateRoutine({
        skin_behavior: answers.skinBehavior ?? "",
        concerns: answers.concerns,
      });
      if (failed) return;
      clearTimers();
      setStageIndex(2);
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 600);
      });
      const stored = makeStoredRoutine(result);
      pushRoutineToHistory(stored);
      setCurrentRoutine(stored);
      router.push("/dashboard");
    } catch {
      fail();
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="display border-2 border-line bg-surface px-3 py-1.5 text-lg tracking-tight brutal-shadow-sm"
          aria-label="SkinSense home"
        >
          SKIN<span className="text-clay-deep">SENSE</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 sm:px-8 sm:py-10">
        <div key={step} ref={stepRef} tabIndex={-1} className="focus:outline-none">
          {step === "welcome" && (
            <section className="mx-auto max-w-2xl text-center">
              <Card className="px-6 py-10 sm:py-14">
                <p className="eyebrow">Welcome to SkinSense</p>
                <h1 className="display mt-4 text-3xl sm:text-4xl">
                  Let&apos;s understand your skin before we change your routine.
                </h1>
                <div className="mt-8">
                  <Button variant="primary" size="lg" onClick={() => setStep("why")}>
                    Begin
                  </Button>
                </div>
              </Card>
            </section>
          )}

          {step === "why" && (
            <section aria-labelledby="why-heading">
              <p className="eyebrow">Before we start</p>
              <h1 id="why-heading" className="display mt-2 text-2xl sm:text-3xl">
                Why SkinSense asks first.
              </h1>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {reasons.map((reason) => (
                  <div
                    key={reason.number}
                    className={`brutal brutal-shadow-sm ${reason.tone} p-5`}
                  >
                    <span className="eyebrow">{reason.number}</span>
                    <h2 className="display mt-2 text-lg">{reason.title}</h2>
                    <p className="mt-2 text-sm text-ink-soft">{reason.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <Button variant="quiet" onClick={() => setStep("welcome")}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setStep("q1")}>
                  Continue
                </Button>
              </div>
            </section>
          )}

          {step === "q1" && (
            <SkinFeelStep
              value={answers.skinBehavior}
              onChange={(value) => updateAnswer("skinBehavior", value)}
              onBack={() => goBackFromQuestion(1)}
              onNext={() => goNextFromQuestion(1)}
            />
          )}

          {step === "q2" && (
            <ConcernsStep
              value={answers.concerns}
              onChange={(value) => updateAnswer("concerns", value)}
              onBack={() => goBackFromQuestion(2)}
              onNext={() => goNextFromQuestion(2)}
            />
          )}

          {step === "q3" && (
            <SensitivityStep
              value={answers.sensitivity}
              onChange={(value) => updateAnswer("sensitivity", value)}
              onBack={() => goBackFromQuestion(3)}
              onNext={() => goNextFromQuestion(3)}
            />
          )}

          {step === "q4" && (
            <ProductsStep
              value={answers.products}
              onChange={(value) => updateAnswer("products", value)}
              draft={productDraft}
              onDraftChange={setProductDraft}
              onBack={() => goBackFromQuestion(4)}
              onNext={() => goNextFromQuestion(4)}
              onSkip={() => {
                setProductDraft("");
                goNextFromQuestion(4);
              }}
            />
          )}

          {step === "q5" && (
            <PrefsStep
              value={answers.prefs}
              onChange={(value) => updateAnswer("prefs", value)}
              onBack={() => goBackFromQuestion(5)}
              onNext={() => goNextFromQuestion(5)}
            />
          )}

          {step === "q6" && (
            <NotesStep
              value={answers.notes}
              onChange={(value) => updateAnswer("notes", value)}
              onBack={() => goBackFromQuestion(6)}
              onNext={() => goNextFromQuestion(6)}
            />
          )}

          {step === "review" && (
            <ReviewScreen
              answers={answers}
              saving={saving}
              saveError={saveError}
              onConfirm={handleConfirm}
              onBack={() => setStep("q6")}
              onEdit={(target) => {
                setEditReturn(target);
                setStep(`q${target}`);
              }}
            />
          )}

          {step === "done" && (
            <section aria-labelledby="done-heading" className="mx-auto max-w-xl">
              <Card className="text-center">
                <p className="eyebrow">All set</p>
                <h1 id="done-heading" className="display mt-2 text-3xl">
                  Your profile is ready.
                </h1>
                <p className="mt-3 text-base text-ink-soft">
                  SkinSense saved what you told it. Build a routine where every step
                  explains itself.
                </p>

                {buildPhase === "idle" && (
                  <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button variant="primary" onClick={handleBuild}>
                      Build my first routine
                    </Button>
                    <Link href="/dashboard" className="btn">
                      Go to dashboard
                    </Link>
                  </div>
                )}

                {buildPhase === "loading" && (
                  <div className="mt-7 text-left">
                    <LoadingStages stages={buildStages} activeIndex={stageIndex} />
                  </div>
                )}

                {buildPhase === "error" && (
                  <div className="mt-7 text-left">
                    <ErrorState
                      title="Couldn't build your routine."
                      body="SkinSense couldn't build your routine right now. Your answers are saved — try again."
                      onRetry={handleBuild}
                    />
                    <div className="mt-4 text-center">
                      <Link href="/dashboard" className="btn">
                        Go to dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t-2 border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-bold text-ink">SKINSENSE</p>
          <p>Not a medical device. Educational decision support only.</p>
        </div>
      </footer>
    </div>
  );
}
