export type Source = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ad_id?: string;
  ref?: string;
  landed_at?: string;
};

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ad_id", "ref"] as const;

const clean = (v: string | null | undefined) =>
  (v ?? "").replace(/[^\p{L}\p{N} _.\-:/]/gu, "").trim().slice(0, 100);

export function sourceFromParams(params: URLSearchParams): Source {
  const out: Source = {};
  for (const key of KEYS) {
    const value =
      key === "ad_id"
        ? clean(params.get("ad_id") || params.get("utm_id") || params.get("fbclid") || params.get("gclid"))
        : key === "ref"
          ? clean(params.get("ref") || params.get("code"))
          : clean(params.get(key));
    if (value) out[key] = value;
  }
  return out;
}

export function hasSource(s: Source) {
  return KEYS.some((k) => s[k]);
}

export function encodeSource(s: Source) {
  return encodeURIComponent(JSON.stringify(s));
}

export function decodeSource(raw: string | undefined | null): Source {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;
    const out: Source = {};
    for (const key of [...KEYS, "landed_at"] as const) {
      if (typeof parsed[key] === "string") out[key] = clean(parsed[key] as string);
    }
    return out;
  } catch {
    return {};
  }
}
