"use client";

import { useEffect, useState } from "react";

/** Phone-only bottom bar; hides while the form itself is on screen. */
export function StickyCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const form = document.getElementById("reserve");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(Boolean(entry?.isIntersecting)), {
      rootMargin: "0px 0px -15% 0px",
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 pt-3 backdrop-blur transition-transform duration-200 md:hidden ${hidden ? "translate-y-full" : ""}`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href="#reserve"
        tabIndex={hidden ? -1 : 0}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-sage text-base font-semibold text-white active:bg-sage-dark"
      >
        Reserve your spot
      </a>
    </div>
  );
}
