export type Variant = "A" | "B";

export type Experiments = {
  /** Visitor id, stable across visits. */
  vid: string;
  message: Variant;
  price: Variant;
  commitment: Variant;
};

export const EXPERIMENT_COOKIE = "vw_ab";
export const SOURCE_COOKIE = "vw_src";

const isVariant = (v: unknown): v is Variant => v === "A" || v === "B";

export function newExperiments(rand: () => number = Math.random): Experiments {
  const pick = (): Variant => (rand() < 0.5 ? "A" : "B");
  return { vid: crypto.randomUUID(), message: pick(), price: pick(), commitment: pick() };
}

export function encodeExperiments(e: Experiments) {
  return [e.vid, e.message, e.price, e.commitment].join(".");
}

export function decodeExperiments(raw: string | undefined | null): Experiments | null {
  if (!raw) return null;
  const [vid, message, price, commitment] = raw.split(".");
  if (!vid || !/^[0-9a-f-]{36}$/i.test(vid)) return null;
  if (!isVariant(message) || !isVariant(price) || !isVariant(commitment)) return null;
  return { vid, message, price, commitment };
}

/**
 * Tests switched on via ACTIVE_TESTS (comma list of message, price, commitment).
 * An inactive test shows everyone version A, so its results are not muddied.
 */
export function applyActive(e: Experiments, raw = process.env.ACTIVE_TESTS ?? "message,price"): Experiments {
  const on = new Set(raw.split(",").map((s) => s.trim().toLowerCase()));
  return {
    vid: e.vid,
    message: on.has("message") ? e.message : "A",
    price: on.has("price") ? e.price : "A",
    commitment: on.has("commitment") ? e.commitment : "A",
  };
}

export const headline = {
  A: "Look and feel your best on the day.",
  B: "Healthy skin and energy for your wedding.",
} as const;

export const goldPrice = { A: 35000, B: 45000 } as const;
