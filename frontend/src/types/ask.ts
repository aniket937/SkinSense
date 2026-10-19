export type AskSource = "backend" | "demo";

export type AskMessage = {
  id: string;
  role: "user" | "skinsense";
  text: string;
  source?: AskSource;
  topic?: string;
};

export type AskResult = {
  text: string;
  source: AskSource;
  topic?: string;
};

export type AskContext = {
  topic?: string;
  product?: string;
};
