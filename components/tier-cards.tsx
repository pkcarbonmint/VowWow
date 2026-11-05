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
    <div className="mt-8 grid gap-4 md:grid-cols-3 md:items-stretch">
      {tiers.map((tier) => (
        <article
          key={tier.id}
          className={`relative flex flex-col rounded-3xl border p-6 ${
            tier.featured ? "border-sage bg-paper shadow-[0_18px_40px_-28px_rgba(63,95,79,0.8)]" : "border-line bg-paper/70"
          }`}
        >
          {tier.featured ? (
            <span className="absolute -top-3 left-6 rounded-full bg-sage px-3 py-1 text-xs font-semibold tracking-wide text-white">
              Most chosen
            </span>
          ) : null}
          <h3 className="font-serif text-3xl">{tier.name}</h3>
          <p className="mt-1 text-lg font-semibold">{tier.price}</p>
          <p className="text-xs text-muted">Indicative price</p>
          <ul className="mt-5 flex-1 space-y-2 text-[0.95rem] leading-relaxed text-muted">
            {tier.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => choose(tier.id)}
            className={`mt-6 min-h-12 rounded-full px-5 font-semibold ${
              tier.featured ? "bg-sage text-white hover:bg-sage-dark" : "border border-sage text-sage hover:bg-sage-soft"
            }`}
          >
            I&apos;m interested in {tier.name}
          </button>
        </article>
      ))}
    </div>
  );
}
