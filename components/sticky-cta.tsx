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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-sage-soft/70 bg-ivory/98 px-4 pt-4 backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 md:hidden ${hidden ? "translate-y-full" : ""}`}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href="#reserve"
        tabIndex={hidden ? -1 : 0}
        className="flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-sage to-sage-bright text-base font-bold text-white active:scale-95 transition-transform duration-200 shadow-lg"
      >
        Reserve your spot
      </a>
    </div>
  );
}
