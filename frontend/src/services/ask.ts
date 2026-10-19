import type { AskContext, AskResult } from "@/types/ask";
import type { ProductCheckResult } from "@/types/product";
import { explainIngredient } from "./ingredient";
import { getCurrentRoutine } from "./routine";
import { STORAGE_KEYS, loadJSON } from "@/lib/storage";
import { titleCase } from "@/lib/format";

const KNOWN_INGREDIENTS = [
  "niacinamide",
  "salicylic acid",
  "hyaluronic acid",
  "retinol",
  "vitamin c",
  "azelaic acid",
  "ceramide",
  "benzoyl peroxide",
  "aha",
  "peptides",
];

function findKnownIngredient(text: string): string | null {
  const lower = text.toLowerCase();
  return KNOWN_INGREDIENTS.find((name) => lower.includes(name)) ?? null;
}

async function ingredientAnswer(name: string): Promise<AskResult> {
  const result = await explainIngredient({ ingredient_name: name });
  const parts: string[] = [];
  if (result.what_it_is) parts.push(result.what_it_is + ".");
  if (result.common_roles.length > 0) {
    parts.push(`It's commonly used for: ${result.common_roles.join(", ")}.`);
  }
  if (result.relevant_considerations.length > 0) {
    parts.push(`Worth knowing: ${result.relevant_considerations.join(" ")}`);
  }
  if (parts.length === 0) {
    parts.push(result.relevant_considerations.join(" "));
  }
  return {
    text: parts.join(" "),
    source: "backend",
    topic: result.ingredient_name,
  };
}

function routineAnswer(): AskResult | null {
  const routine = getCurrentRoutine();
  if (!routine) return null;
  const format = (label: string, steps: typeof routine.morning) =>
    steps.length > 0
      ? `${label}: ${steps
          .map((step) => `${titleCase(step.category)} — ${step.why}`)
          .join(". ")}.`
      : "";
  const lines = [format("Morning", routine.morning), format("Evening", routine.evening)].filter(
    Boolean
  );
  if (lines.length === 0) return null;
  return {
    text: `Here's your current routine and why each step is there. ${lines.join(" ")} These explanations come from the routine SkinSense built for you.`,
    source: "backend",
    topic: "your routine",
  };
}

function productAnswer(question: string, product?: string): AskResult | null {
  const analysis = loadJSON<ProductCheckResult | null>(STORAGE_KEYS.lastAnalysis, null);
  if (!analysis) return null;
  const matchesProduct =
    product !== undefined
      ? analysis.product_name.toLowerCase().includes(product.toLowerCase()) ||
        product.toLowerCase().includes(analysis.product_name.toLowerCase())
      : question.toLowerCase().includes(analysis.product_name.toLowerCase());
  if (!matchesProduct && product === undefined) return null;
  const parts: string[] = [`About ${analysis.product_name || "your checked product"}:`];
  if (analysis.recommendations.length > 0) {
    parts.push(analysis.recommendations.join(". ") + ".");
  }
  if (analysis.warnings.length > 0) {
    parts.push(`Points to consider: ${analysis.warnings.join(". ")}.`);
  } else {
    parts.push("This check reported no specific conflicts with your profile.");
  }
  parts.push("SkinSense doesn't know concentrations or how your skin will respond — patch test and decide for yourself.");
  return {
    text: parts.join(" "),
    source: "backend",
    topic: analysis.product_name,
  };
}

function demoAnswer(question: string, context: AskContext): AskResult {
  if (context.topic) {
    return {
      text: `SkinSense doesn't have reliable, specific information about "${context.topic}" yet, so I won't guess. I can explain ingredients from my reference list, walk through your saved routine, or summarize a product you've checked. The full conversational reasoning endpoint isn't connected in this build — this answer comes from the local demo layer.`,
      source: "demo",
      topic: context.topic,
    };
  }
  return {
    text: `I can help best with something concrete: ask about an ingredient like "What does niacinamide do?", ask about a step in your routine, or check a product first and ask how it fits. The open conversational reasoning endpoint isn't connected in this build — this answer comes from the local demo layer, so I keep it to what SkinSense actually knows.`,
    source: "demo",
  };
}

export async function askSkinSense(
  question: string,
  context: AskContext = {}
): Promise<AskResult> {
  try {
    if (context.topic) {
      return await ingredientAnswer(context.topic);
    }

    const ingredient = findKnownIngredient(question);
    if (ingredient) {
      return await ingredientAnswer(ingredient);
    }

    const lower = question.toLowerCase();

    if (
      context.product ||
      lower.includes("product") ||
      lower.includes("serum") ||
      lower.includes("moisturizer") ||
      lower.includes("this ") ||
      lower.includes("add ")
    ) {
      const fromProduct = productAnswer(question, context.product);
      if (fromProduct) return fromProduct;
    }

    if (lower.includes("routine") || lower.includes("step") || lower.includes("morning") || lower.includes("evening")) {
      const fromRoutine = routineAnswer();
      if (fromRoutine) return fromRoutine;
    }

    return demoAnswer(question, context);
  } catch {
    throw new Error("ask-failed");
  }
}
