export type QuestionIndex = 1 | 2 | 3 | 4 | 5 | 6;

export type Answers = {
  skinBehavior: string | null;
  concerns: string[];
  sensitivity: string | null;
  products: string[];
  prefs: string[];
  notes: string;
};

export type Option = {
  value: string;
  title: string;
  description?: string;
};

export const initialAnswers: Answers = {
  skinBehavior: null,
  concerns: [],
  sensitivity: null,
  products: [],
  prefs: [],
  notes: "",
};

export const skinFeelOptions: Option[] = [
  { value: "oily", title: "Oily", description: "Tends to look shiny by midday" },
  { value: "dry", title: "Dry", description: "Often feels tight or lacking moisture" },
  {
    value: "combination",
    title: "Combination",
    description: "Oily in some areas, drier in others",
  },
  { value: "normal", title: "Normal", description: "Generally comfortable and balanced" },
];

export const concernOptions: Option[] = [
  { value: "acne", title: "Acne" },
  { value: "dryness", title: "Dryness" },
  { value: "oiliness", title: "Oiliness" },
  { value: "sensitivity", title: "Sensitivity" },
  { value: "uneven texture", title: "Uneven texture" },
];

export const sensitivityOptions: Option[] = [
  { value: "low", title: "Low", description: "Rarely reacts to new products" },
  { value: "medium", title: "Medium", description: "Sometimes reacts to new products" },
  { value: "high", title: "High", description: "Reacts to new products easily" },
];

export const prefOptions: Option[] = [
  { value: "quick routine", title: "Quick routine", description: "Done in a few minutes" },
  { value: "minimal steps", title: "Minimal steps", description: "Only the essentials" },
  {
    value: "gentle actives",
    title: "Gentle actives",
    description: "Softer, low-intensity options where possible",
  },
  { value: "budget-friendly", title: "Budget-friendly", description: "Keep costs practical" },
];

export const buildStages = [
  "Reading your profile",
  "Building your plan",
  "Reviewing the result",
];
