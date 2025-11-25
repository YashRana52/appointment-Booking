"use client";
import { userAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { fetchProfile, token } = userAuthStore();
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (token) {
        await fetchProfile();
      }
      setProfileLoaded(true);
    };
    load();
  }, [token, fetchProfile]);

  if (!profileLoaded) return null; // wait until profile is fully loaded

  return <>{children}</>;
}
