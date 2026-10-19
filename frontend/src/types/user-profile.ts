export type UserProfile = {
  id: string;
  skin_behavior: string | null;
  sensitivity: string | null;
  concerns: string[];
  current_products: string[];
  created_at: string | null;
  updated_at: string | null;
};
