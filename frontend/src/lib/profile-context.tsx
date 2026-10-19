"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "@/types/user-profile";
import { getProfile, updateProfile } from "@/services/user-profile";

type ProfileSaveInput = {
  skin_behavior?: string;
  sensitivity?: string;
  concerns?: string[];
  current_products?: string[];
};

type ProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
  save: (input: ProfileSaveInput) => Promise<UserProfile>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    setError(false);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(
    async (input: ProfileSaveInput) => {
      const next = await updateProfile(input);
      setProfile(next);
      return next;
    },
    []
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ profile, loading, error, refresh, save }),
    [profile, loading, error, refresh, save]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return ctx;
}
