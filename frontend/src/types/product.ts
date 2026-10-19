export type ProductCheckRequest = {
  product_name: string;
  ingredients: string[];
  skin_behavior: string;
  concerns: string[];
};

export type IngredientAnalysisEntry = {
  ingredient: string;
  roles: string[];
  suitable: boolean | null;
  contraindications: string[];
};

export type ProductCheckResult = {
  product_name: string;
  compatibility_score: number;
  warnings: string[];
  recommendations: string[];
  ingredient_analysis: IngredientAnalysisEntry[];
};

export type CompatibilityState =
  | "compatible"
  | "consider"
  | "insufficient"
  | "escalation";

export type ProductAnalysisMeta = {
  brand: string | null;
  ingredientsProvided: string[];
  recognized: number;
  unknown: number;
  freeForm: boolean;
};
