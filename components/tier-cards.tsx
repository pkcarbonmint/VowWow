"use client";

import { track } from "@/lib/track";

export type Tier = {
  id: "silver" | "gold" | "platinum";
  name: string;
  price: string;
  items: string[];
  featured?: boolean;
};

export const TIER_EVENT = "weddingwell:tier";

export function TierCards({ tiers }: { tiers: Tier[] }) {
  const choose = (id: Tier["id"]) => {
    track("tier_clicked", { tier: id });
    window.dispatchEvent(new CustomEvent(TIER_EVENT, { detail: id }));
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
      {tiers.map((tier, i) => (
        <article
          key={tier.id}
          className={`relative flex flex-col rounded-3xl border p-8 card-hover animate-on-scroll${i > 0 ? `-delay-${Math.min(i, 2)}` : ''} ${
            tier.featured 
              ? "border-sage-bright bg-gradient-to-br from-white to-sage-soft/50 shadow-[0_20px_60px_rgba(45,102,83,0.2)] scale-105" 
              : "border-sage-soft bg-gradient-to-br from-white to-paper shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
          }`}
        >
          {tier.featured ? (
            <span className="absolute -top-4 left-8 rounded-full bg-gradient-to-r from-sage to-sage-bright px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg">
              Most chosen
            </span>
          ) : null}
          <h3 className="font-serif text-4xl font-bold text-ink">{tier.name}</h3>
          <p className="mt-2 text-xl font-bold text-sage-dark">{tier.price}</p>
          <p className="text-xs text-muted font-semibold uppercase tracking-wide">Indicative price</p>
          <ul className="mt-7 flex-1 space-y-3 text-[15px] leading-relaxed text-muted">
            {tier.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-gradient-to-br from-sage to-sage-bright" />
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => choose(tier.id)}
            className={`mt-8 min-h-13 rounded-full px-6 font-bold transition-all duration-300 ${
              tier.featured 
                ? "bg-gradient-to-r from-sage to-sage-bright text-white hover:shadow-xl hover:scale-[1.02]" 
                : "border-2 border-sage-bright text-sage-bright hover:bg-sage-bright hover:text-white"
            }`}
          >
            I&apos;m interested in {tier.name}
          </button>
        </article>
      ))}
    </div>
  );
}
