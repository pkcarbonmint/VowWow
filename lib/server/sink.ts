import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type SheetTab = "Leads" | "Commitments" | "Events" | "Privacy";
type Row = Record<string, string | number | boolean | null | undefined>;

/**
 * Writes one row to the shared Google Sheet (see scripts/google-apps-script.js).
 * Locally, without a sheet URL, rows go to data/<tab>.jsonl so the flow can be tested offline.
 */
export async function writeRow(tab: SheetTab, row: Row): Promise<void> {
  const record = { at: new Date().toISOString(), ...row };
  const url = process.env.SHEETS_WEBHOOK_URL;

  if (url) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET ?? "", tab, row: record }),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    // Apps Script answers 200 even when it rejects a request, so the JSON body is the real result.
    const text = await res.text();
    let reply: { ok?: boolean; error?: string } = {};
    try {
      reply = JSON.parse(text);
    } catch {
      throw new Error(`Sheet webhook returned non-JSON (HTTP ${res.status}). Check the web app's "Who has access" is "Anyone". Starts: ${text.slice(0, 80)}`);
    }
    if (!res.ok || reply.ok !== true) {
      throw new Error(`Sheet webhook rejected the row (HTTP ${res.status}): ${reply.error ?? "unknown error"}`);
    }
    return;
  }

  if (process.env.VERCEL) {
    console.warn(`[weddingwell] SHEETS_WEBHOOK_URL is not set; ${tab} row only logged`, JSON.stringify(record));
    return;
  }

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, `${tab.toLowerCase()}.jsonl`), JSON.stringify(record) + "\n");
}

/** Analytics must never break the visitor's flow. */
export async function writeRowQuietly(tab: SheetTab, row: Row) {
  try {
    await writeRow(tab, row);
  } catch (error) {
    console.error(`[weddingwell] could not write ${tab} row`, error);
  }
}
