"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

const problems = [
  "How do I know my skin type?",
  "Why do two products with the same ingredient feel different?",
  "How do I know whether this product fits my routine?",
  "What do these acids and actives actually do?",
  "How do I know whether my skincare is really working?",
];

const capabilities = [
  {
    title: "Understand Your Skin",
    body: "Answer a few plain questions and see exactly what SkinSense understood about your skin — and what it still doesn't know.",
    href: "/onboarding",
    tone: "bg-blush" as const,
    number: "01",
  },
  {
    title: "Build Your Routine",
    body: "Get a simple morning and evening routine with a short explanation of why each step exists.",
    href: "/routine",
    tone: "bg-moss" as const,
    number: "02",
  },
  {
    title: "Check Your Products",
    body: "See how a product fits with what you already use — before you buy it or layer it on.",
    href: "/check-product",
    tone: "bg-honey" as const,
    number: "03",
  },
  {
    title: "Understand Ingredients",
    body: "Skincare terms explained simply, so you can read a label with confidence.",
    href: "/ingredients",
    tone: "bg-sky" as const,
    number: "04",
  },
];

const pipeline = [
  { label: "Your context", body: "Your skin, concerns and routine — what you told SkinSense." },
  { label: "Relevant knowledge", body: "Only the skincare knowledge that matches your question." },
  { label: "Open-weight AI", body: "An open model reasons over that small, focused context." },
  { label: "Validation", body: "The answer must fit a fixed, reviewable format." },
  { label: "Safety", body: "Checked against safety rules before it reaches you." },
  { label: "Response", body: "A clear answer — with uncertainty kept visible." },
];

const principles = [
  "No diagnosis",
  "No fake certainty",
  "No blind product pushing",
  "Clear uncertainty",
  "Safety-first guidance",
];

function MiniCard({ label, glyph, tone }: { label: string; glyph: string; tone: string }) {
  return (
    <div className={`brutal brutal-shadow-sm ${tone} px-3 py-2`}>
      <span aria-hidden="true" className="mr-2 text-sm">
        {glyph}
      </span>
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="display border-2 border-line bg-surface px-3 py-1.5 text-lg tracking-tight brutal-shadow-sm"
          aria-label="SkinSense home"
        >
          SKIN<span className="text-clay-deep">SENSE</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link href="/dashboard" className="btn btn-sm hidden sm:inline-flex">
            Open Dashboard
          </Link>
          <Link href="/onboarding" className="btn btn-sm btn-primary">
            Get Started
          </Link>
        </nav>
      </header>

      <main id="main-content">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="eyebrow">Your skincare companion</p>
              <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl">
                Skincare decisions, made easier to understand.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                SkinSense helps you understand your skin context, your routine, what
                ingredients actually do, and how a product fits — before you make a
                skincare decision.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/onboarding" className="btn btn-primary btn-lg">
                  Understand My Skin
                </Link>
                <a href="#how" className="btn btn-lg">
                  See How It Works
                </a>
              </div>
            </div>

            <div className="relative" aria-hidden="true">
              <div className="brutal brutal-shadow-lg bg-surface p-5">
                <p className="eyebrow">One companion</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniCard label="Skin profile" glyph="◍" tone="bg-blush" />
                  <MiniCard label="Routine" glyph="≡" tone="bg-moss" />
                  <MiniCard label="Your product" glyph="▢" tone="bg-honey" />
                  <MiniCard label="Ingredient" glyph="❋" tone="bg-sky" />
                </div>
                <div className="mt-4 border-2 border-line bg-paper p-3">
                  <p className="text-sm font-semibold">Why is this step here?</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Every recommendation comes with a reason you can read.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="border-2 border-line bg-surface px-2 py-0.5 text-xs font-bold uppercase">
                    Explain
                  </span>
                  <span className="border-2 border-line bg-surface px-2 py-0.5 text-xs font-bold uppercase">
                    Compare
                  </span>
                  <span className="border-2 border-line bg-blush px-2 py-0.5 text-xs font-bold uppercase">
                    Uncertain?
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="border-y-2 border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
            <SectionHeading
              eyebrow="The real problem"
              title="Skincare is full of small, expensive guessing games."
              sub="Most of us make these decisions with a label, a reel, and hope."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((question) => (
                <blockquote
                  key={question}
                  className="brutal brutal-shadow brutal-hover bg-paper p-5"
                >
                  <p className="display text-lg italic leading-snug">“{question}”</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <SectionHeading
            eyebrow="How SkinSense helps"
            title="Four ways it makes decisions clearer."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {capabilities.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`brutal brutal-shadow brutal-hover ${item.tone} flex flex-col p-6`}
              >
                <span className="eyebrow">{item.number}</span>
                <h3 className="display mt-2 text-2xl">{item.title}</h3>
                <p className="mt-2 flex-1 text-base text-ink-soft">{item.body}</p>
                <span className="mt-4 text-sm font-bold uppercase tracking-wide">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y-2 border-line bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
            <p className="eyebrow text-paper/70">Open AI, plain language</p>
            <h2 className="display mt-2 max-w-2xl text-3xl sm:text-4xl">
              How an answer actually gets made.
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pipeline.map((step, index) => (
                <li
                  key={step.label}
                  className="border-2 border-paper/80 bg-paper p-5 text-ink shadow-[4px_4px_0_rgba(245,239,230,0.35)]"
                >
                  <span className="eyebrow text-clay-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-lg font-bold">{step.label}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Ask by voice"
                title="Speak the way you actually think."
                sub="Ask in English, Hindi, or a mix — SkinSense listens, reasons through the same pipeline, and answers out loud."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ask?voice=1" className="btn btn-primary">
                  Try Voice
                </Link>
                <Link href="/ask" className="btn">
                  Ask with Text
                </Link>
              </div>
            </div>
            <Card tone="blush">
              <p className="eyebrow">Example question</p>
              <p className="display mt-3 text-2xl italic leading-snug">
                “Ye serum mere routine ke saath theek rahega?”
              </p>
              <p className="mt-4 text-base text-ink-soft">
                Will this serum work well with my current routine?
              </p>
              <p className="mt-4 text-sm font-semibold">
                Ask naturally. Understand the answer. Decide for yourself.
              </p>
            </Card>
          </div>
        </section>

        <section className="border-y-2 border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
            <SectionHeading
              eyebrow="Responsible by design"
              title="What SkinSense won't do."
            />
            <ul className="mt-8 flex flex-wrap gap-3">
              {principles.map((principle) => (
                <li
                  key={principle}
                  className="brutal brutal-shadow-sm bg-paper px-4 py-2 text-sm font-bold uppercase tracking-wide"
                >
                  {principle}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-2xl text-base text-ink-soft">
              SkinSense is an educational decision-support companion. It won't diagnose
              you, guarantee results, or push you toward a purchase. When it doesn't
              know something, it says so.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="brutal brutal-shadow-lg bg-blush p-8 text-center sm:p-12">
            <h2 className="display mx-auto max-w-2xl text-3xl sm:text-4xl">
              Start Understanding Your Skin
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-ink-soft">
              A few plain questions. A routine that explains itself. Clearer product
              decisions.
            </p>
            <div className="mt-7">
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Understand My Skin
              </Link>
            </div>
          </div>
        </section>
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
