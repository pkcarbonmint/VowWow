import { allow, reply } from "@/lib/server/guard";
import { writeRow } from "@/lib/server/sink";

/** Writes one test row to the Events tab and reports whether the sheet accepted it. Returns no lead data. */
export async function GET(request: Request) {
  if (!allow(request, "sheet-check", 5, 10 * 60_000)) return reply({ error: "Too many checks. Try again shortly." }, 429);

  const configured = {
    SHEETS_WEBHOOK_URL: Boolean(process.env.SHEETS_WEBHOOK_URL),
    url_looks_right: /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(process.env.SHEETS_WEBHOOK_URL?.trim() ?? ""),
    SHEETS_WEBHOOK_SECRET: Boolean(process.env.SHEETS_WEBHOOK_SECRET),
  };
  if (!configured.SHEETS_WEBHOOK_URL) return reply({ ok: false, configured, error: "SHEETS_WEBHOOK_URL is not set on this deployment." });

  try {
    await writeRow("Events", { event: "sheet_check" });
    return reply({ ok: true, configured, message: "A sheet_check row was added to the Events tab." });
  } catch (error) {
    return reply({ ok: false, configured, error: error instanceof Error ? error.message : String(error) });
  }
}
