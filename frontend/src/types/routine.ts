export type RoutineStep = {
  step: number;
  category: string;
  purpose: string;
  why: string;
};

export type RoutineResult = {
  morning: RoutineStep[];
  evening: RoutineStep[];
  reasons: string[];
  safety_notes: string[];
};

export type StoredRoutine = RoutineResult & {
  id: string;
  createdAt: string;
};
