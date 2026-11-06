"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  return <>{children}</>;
}
