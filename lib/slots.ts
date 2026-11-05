/** Free 15-minute discovery calls: Mon–Sat, India time, booked at least 3 hours ahead, up to 10 days out. */
const TIMES = ["11:00", "11:30", "12:00", "16:00", "16:30", "17:00", "18:30", "19:00"];
const IST = "+05:30";

function istDate(now: Date, addDays: number) {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  const midnight = new Date(`${ymd}T00:00:00${IST}`);
  return new Date(midnight.getTime() + addDays * 86_400_000);
}

export function upcomingSlots(now = new Date(), days = 10): string[] {
  const earliest = now.getTime() + 3 * 3_600_000;
  const slots: string[] = [];
  for (let d = 0; d <= days; d++) {
    const day = istDate(now, d);
    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(day);
    const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short" }).format(day);
    if (weekday === "Sun") continue;
    for (const time of TIMES) {
      const iso = `${ymd}T${time}:00${IST}`;
      if (new Date(iso).getTime() >= earliest) slots.push(iso);
    }
  }
  return slots;
}

export function isBookableSlot(iso: string, now = new Date()) {
  return upcomingSlots(now).includes(iso);
}
