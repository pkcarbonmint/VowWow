const env = (key: string, fallback: string) => process.env[key]?.trim() || fallback;
const envInt = (key: string, fallback: number) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
};

export const site = {
  name: "WeddingWell",
  city: env("NEXT_PUBLIC_LAUNCH_CITY", "Delhi NCR"),
  businessName: env("NEXT_PUBLIC_BUSINESS_NAME", "WeddingWell (registered entity name to be added)"),
  address: env("NEXT_PUBLIC_BUSINESS_ADDRESS", "Registered address to be published before deposits open"),
  grievanceOfficer: env("NEXT_PUBLIC_GRIEVANCE_OFFICER", "Grievance Officer"),
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@weddingwell.in"),
  depositInr: envInt("NEXT_PUBLIC_DEPOSIT_INR", 1499),
  refundDays: envInt("NEXT_PUBLIC_REFUND_DAYS", 7),
  deletionDays: envInt("NEXT_PUBLIC_DELETION_DAYS", 15),
};

export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL) return "https://weddingwell.vercel.app";
  return "http://localhost:3000";
}

/** Launch micro-market. Edit once the city is confirmed. */
export const areas = [
  { value: "south-delhi", label: "South Delhi" },
  { value: "vasant-vihar", label: "Vasant Vihar / Chanakyapuri" },
  { value: "gk-defence-colony", label: "GK / Defence Colony / Jor Bagh" },
  { value: "gurugram-golf-course", label: "Gurugram – Golf Course Road / DLF" },
  { value: "noida", label: "Noida" },
  { value: "other-ncr", label: "Elsewhere in Delhi NCR" },
  { value: "outside", label: "Outside Delhi NCR" },
] as const;

export const launchAreas = new Set<string>([
  "south-delhi",
  "vasant-vihar",
  "gk-defence-colony",
  "gurugram-golf-course",
]);

export const tierIds = ["silver", "gold", "platinum", "unsure"] as const;
export type TierId = (typeof tierIds)[number];

export const roles = ["bride", "groom", "family"] as const;
