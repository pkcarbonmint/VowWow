/**
 * WeddingWell lead sheet.
 *
 * 1. Create a Google Sheet. Extensions > Apps Script. Paste this file.
 * 2. Project Settings > Script properties: add SECRET = the same value as SHEETS_WEBHOOK_SECRET.
 * 3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * 4. Put the web app URL in SHEETS_WEBHOOK_URL on Vercel.
 *
 * Tabs (Leads, Commitments, Events, Privacy) and their headers are created automatically.
 * Share the sheet only with named team members.
 */
const TABS = ["Leads", "Commitments", "Events", "Privacy"];

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!secret || body.secret !== secret) return json({ ok: false, error: "unauthorised" });
  if (TABS.indexOf(body.tab) === -1) return json({ ok: false, error: "unknown tab" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(body.tab) || ss.insertSheet(body.tab);
    const row = body.row || {};
    let headers = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    const missing = Object.keys(row).filter((k) => headers.indexOf(k) === -1);
    if (missing.length) {
      headers = headers.concat(missing);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(headers.map((h) => (row[h] === undefined || row[h] === null ? "" : row[h])));
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
