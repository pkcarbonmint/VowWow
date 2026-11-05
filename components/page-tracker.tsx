"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export function PageTracker() {
  useEffect(() => {
    track("page_view");
    const packages = document.getElementById("packages");
    if (!packages) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          track("packages_viewed");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(packages);
    return () => observer.disconnect();
  }, []);
  return null;
}
