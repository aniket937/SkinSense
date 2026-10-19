"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useProfile } from "@/lib/profile-context";
import { getCurrentRoutine } from "@/services/routine";
import { explainIngredient } from "@/services/ingredient";
import { checkProduct } from "@/services/product";
import { generateRoutine } from "@/services/routine";
import { format } from "@/lib/format";

type DemoClient = {
  skinBehavior: string;
  sensitivity: string;
  concerns: string[];
  products: string[];
};

const demoClients: Record<string, DemoClient> = {
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

export default function ConsultationPage() {
  const { profile, loading } = useProfile();
  const [step, setStep] = useState<number>(1); // 1=context, 2=ingredient, 3=product, 4=routine, 5=report
  const [client, setClient] = useState<DemoClient | null>(null);
  const [ingredientName, setIngredientName] = useState("");
  const [productName, setProductName] = useState("");
  const [routine, setRoutine] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

  // Initialise client from dashboard selector
  useEffect(() => {
    const clientId = localStorage.getItem("selectedClient") ?? "demo-1";
    const clientData = demoClients[clientId];
    if (clientData) {
      setClient(clientData);
    }
  }, []);

  // When client changes, reset steps
  useEffect(() => {
    setStep(1);
    setRoutine(null);
    setReport(null);
    setShowReport(false);
  }, [client]);

  // Load routine once we have client context
  useEffect(() => {
    if (!client) return;
    const routine = getCurrentRoutine();
    if (routine) setRoutine(routine);
  }, [client]);

  // ----- Step 1: Client context -----
  if (step === 1) {
    if (!client) {
      return (
        <Card>
          <p className="eyebrow">Client Workspace</p>
          <h2 className="display mt-1 text-2xl">Select a client</h2>
          <p className="mt-4 text-base text-ink-soft">
            Choose a demo client or add a new one via the Dashboard.
          </p>
        </Card>
      );
    }
    return (
      <Card>
        <p className="eyebrow">Client Context</p>
        <h2 className="display mt-1 text-2xl">Client Overview</h2>
        <dl className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <dt className="eyebrow">Skin behavior</dt>
            <dd>{client?.skinBehavior}</dd>
          </div>
          <div>
            <dt className="eyebrow">Sensitivity</dt>
            <dd>{client?.sensitivity}</dd>
          </div>
          <div>
            <dt className="eyebrow">Concerns</dt>
            <dd>
              {client?.concerns.map((c, i) => (
                <Badge key={i} tone="muted">{c}</Badge>
              ))}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Products</dt>
            <dd>{client?.products.length > 0 ? client.products.join(", ") : "None listed"}</dd>
          </div>
        </dl>
        <div className="mt-6 flex gap-3">
          <Link href="/check-product" className="btn btn-primary">
            Check a Product
          </Link>
          <Link href="/ask?topic=routine" className="btn">
            Explain an Ingredient
          </Link>
        </div>
      </Card>
    );
  }

  // ----- Step 2: Ingredient explanation -----
  if (step === 2) {
    return (
      <Card>
        <p className="eyebrow">Ingredient Explanation</p>
        <h2 className="display mt-1 text-2xl">Explain an Ingredient</h2>
        <p className="mt-4 text-base text-ink-soft">
          Enter an ingredient name to receive a structured explanation
          (using deterministic demo data if no live model is running).
        </p>
        <div className="mt-6">
          <input
            id="ingredient-input"
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            placeholder="e.g. niacinamide"
            className="field w-full"
            required
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStep(1)}
            className="btn btn-secondary">
            Back
          </button>
          <button
            onClick={() => setStep(3)}
            className="btn btn-primary">
            Continue
          </button>
        </div>
      </Card>
    );
  }

  // ----- Step 3: Product check -----
  if (step === 3) {
    return (
      <Card>
        <p className="eyebrow">Product Analysis</p>
        <h2 className="display mt-1 text-2xl">Check a Product</h2>
        <p className="mt-4 text-base text-ink-soft">
          Paste an ingredient list or choose a product to analyse against the
          client's routine.
        </p>
        <div className="mt-6">
          <input
            id="product-input"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. CeraVe Moisturizer"
            className="field w-full"
            required
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setStep(1)} className="btn btn-secondary">
            Back
          </button>
          <button
            onClick={() => setStep(4)}
            className="btn btn-primary"
            disabled={!productName.trim()}
          >
            Analyse
          </button>
        </div>
      </Card>
    );
  }

  // ----- Step 4: Routine generation -----
  if (step === 4) {
    // If we don't have a routine yet, generate one from client context
    if (!routine) {
      try {
        const resp = await generateRoutine({
          skin_behavior: client?.skinBehavior ?? "combination",
          concerns: client?.concerns ?? [],
        });
        setRoutine(resp);
      } catch (_) {
        // fallback to demo fixture
        setRoutine({
          morning: [
            { step: 1, category: "cleanser", purpose: "Balanced cleanse", why: "Clean skin gently" },
            { step: 2, category: "moisturizer", purpose: "Light hydration", why: "Hydrate without clogging pores" },
          ],
          evening: [
            { step: 1, category: "moisturizer", purpose: "Overnight repair", why: "Restore skin while you sleep" },
          ],
          reasons: [],
          safety_notes: ["Patch test new products before full application"],
        });
      }
    }
    return (
      <Card>
        <p className="eyebrow">Routine Draft</p>
        <h2 className="display mt-1 text-2xl">Your Personalised Routine</h2>
        <p className="mt-3 text-base text-ink-soft">
          The following draft is generated from the client's skin behaviour and
          concerns. Review and edit before creating the client report.
        </p>
        {routine ? (
          <dl className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <dt className="eyebrow">Morning</dt>
              <dd>
                {routine.morning.map((s: any, i: number) => (
                  <p key={i} className="text-base">
                    <span className="font-semibold">{format.titleCase(s.category)}</span>
                    — {s.purpose}
                  </p>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Evening</dt>
              <dd>
                {routine.evening.map((s: any, i: number) => (
                  <p key={i} className="text-base">
                    <span className="font-semibold">{format.titleCase(s.category)}</span>
                    — {s.purpose}
                  </p>
                ))}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-base text-ink-soft">Routine could not be loaded.</p>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={() => setStep(1)} className="btn btn-secondary">
            Back
          </button>
          <Link href="/report" className="btn btn-primary">
            Generate Client Report
          </Link>
        </div>
      </Card>
    );
  }

  // ----- Step 5: Report preview -----
  if (step === 5) {
    // Build a simple report object from whatever we have
    const reportData = {
      clientId: localStorage.getItem("selectedClient") ?? "demo-1",
      date: new Date().toLocaleDateString(),
      skinBehavior: client?.skinBehavior ?? "combination",
      concerns: client?.concerns ?? [],
      currentProducts: client?.products ?? [],
      routine: routine,
      ingredientExplanations: [],
      productAnalysis: {},
      uncertainties: ["OCR not available in this build; manual ingredient entry used."],
      safetyDisclaimer:
        "SkinSense is an educational decision‑support companion – not a diagnosis or prescription.",
      nextStepSummary:
        "Use niacinamide‑based serum morning/evening, avoid high‑concentration AHAs on sensitive skin, schedule follow‑up in 4 weeks.",
    };
    setReport(reportData);
    setShowReport(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <nav aria-label="Consultation steps">
        <div className="flex gap-2 mb-4">
          { [1,2,3,4,5].map(s => (
            <span
              key={s}
              className={`px-3 py-1.5 text-sm font-semibold ${
                s <= step ? "bg-clay-deep text-surface" : "border-line"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </nav>

      {step === 1 ? (
        <Card>
          <p className="eyebrow">Client Workspace</p>
          <h2 className="display mt-1 text-2xl">Client Overview</h2>
          <p className="mt-4 text-base text-ink-soft">
            Choose a demo client or add a new one via the Dashboard.
          </p>
        </Card>
      ) : step === 2 ? (
        <Card>
          <p className="eyebrow">Ingredient Explanation</p>
          <h2 className="display mt-1 text-2xl">Explain an Ingredient</h2>
          <p className="mt-4 text-base text-ink-soft">
            Enter an ingredient name to receive a structured explanation
            (using deterministic demo data if no live model is running).
          </p>
          <div className="mt-6">
            <input
              id="ingredient-input"
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              placeholder="e.g. niacinamide"
              className="field w-full"
              required
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              Continue
            </button>
          </div>
        </Card>
      ) : step === 3 ? (
        <Card>
          <p className="eyebrow">Product Analysis</p>
          <h2 className="display mt-1 text-2xl">Check a Product</h2>
          <p className="mt-4 text-base text-ink-soft">
            Paste an ingredient list or choose a product to analyse against the
            client's routine.
          </p>
          <div className="mt-6">
            <input
              id="product-input"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. CeraVe Moisturizer"
              className="field w-full"
              required
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="btn btn-primary"
              disabled={!productName.trim()}
            >
              Analyse
            </button>
          </div>
        </Card>
      ) : step === 4 ? (
        <Card>
          <p className="eyebrow">Routine Draft</p>
          <h2 className="display mt-1 text-2xl">Your Personalised Routine</h2>
          <p className="mt-3 text-base text-ink-soft">
            The following draft is generated from the client's skin behaviour and
            concerns. Review and edit before creating the client report.
          </p>
          {routine ? (
            <dl className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <dt className="eyebrow">Morning</dt>
                <dd>
                  {routine.morning.map((s: any, i: number) => (
                    <p key={i} className="text-base">
                      <span className="font-semibold">{format.titleCase(s.category)}</span>
                      — {s.purpose}
                    </p>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Evening</dt>
                <dd>
                  {routine.evening.map((s: any, i: number) => (
                    <p key={i} className="text-base">
                      <span className="font-semibold">{format.titleCase(s.category)}</span>
                      — {s.purpose}
                    </p>
                  ))}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-base text-ink-soft">Routine could not be loaded.</p>
          )}
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <Link href="/report" className="btn btn-primary">
              Generate Client Report
            </Link>
          </div>
        </Card>
      ) : step === 5 ? (
        <Card>
          <p className="eyebrow">Client‑Ready Report</p>
          <h2 className="display mt-1 text-2xl">Report Preview</h2>
          {report ? (
            <dl className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <dt className="eyebrow">Client</dt>
                <dd>{report.clientId}</dd>
              </div>
              <div>
                <dt className="eyebrow">Date</dt>
                <dd>{report.date}</dd>
              </div>
              <div>
                <dt className="eyebrow">Skin behavior</dt>
                <dd>{report.skinBehavior}</dd>
              </div>
              <div>
                <dt className="eyebrow">Concerns</dt>
                <dd>
                  {report.concerns.map((c: string, i: number) => (
                    <Badge key={i} tone="muted">{c}</Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Current products</dt>
                <dd>{report.currentProducts.length > 0 ? report.currentProducts.join(", ") : "None listed"}</dd>
              </div>
            </dl>
            <dl className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <dt className="eyebrow">Morning routine</dt>
                <dd>
                  {report.routine?.morning.map((s: any, i: number) => (
                    <p key={i} className="text-base">
                      <span className="font-semibold">{format.titleCase(s.category)}</span>
                      — {s.purpose}
                    </p>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Evening routine</dt>
                <dd>
                  {report.routine?.evening.map((s: any, i: number) => (
                    <p key={i} className="text-base">
                      <span className="font-semibold">{format.titleCase(s.category)}</span>
                      — {s.purpose}
                    </p>
                  ))}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-base text-ink-soft">
              {report.safetyDisclaimer}
            </p>
            <p className="mt-4 text-base text-ink-soft">
              Next step: {report.nextStepSummary}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.print()}
                className="btn btn-primary w-full"
              >
                Print / Save as PDF
              </button>
            </div>
          ) : (
            <p className="mt-6 text-center text-ink-soft">Generating report…</p>
          )}
        </Card>
      ) : null}
    </div>
  );
}