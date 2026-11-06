import Image from "next/image";
import { PageTracker } from "@/components/page-tracker";
import { SignupFlow } from "@/components/signup-flow";
import { Footer, Header } from "@/components/site-chrome";
import { StickyCta } from "@/components/sticky-cta";
import { TierCards, type Tier } from "@/components/tier-cards";
import { areas, site } from "@/lib/config";
import { goldPrice, headline } from "@/lib/experiments";
import { visitorContext } from "@/lib/server/context";
import { paymentsEnabled } from "@/lib/server/razorpay";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function monthKey(date: Date, addMonths = 0) {
  const [y, m] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit" })
    .format(date)
    .split("-")
    .map(Number);
  const total = y * 12 + (m - 1) + addMonths;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

const pillars = [
  { title: "Metabolic health", body: "Clear baseline labs and a doctor-led plan for steady energy, sleep and digestion through a busy season." },
  { title: "Skin", body: "A dermatologist-guided routine started early enough to settle in – calm, healthy skin rather than a last-minute fix." },
  { title: "Energy & confidence", body: "Simple habits that fit around fittings, functions and family, so you feel like yourself on the day." },
];

const steps = [
  { name: "Reset", when: "6–4 months out", body: "Labs, first consults and a plan that fits your calendar." },
  { name: "Build", when: "4–2 months out", body: "Nutrition, movement and skin routines take hold, with check-ins." },
  { name: "Refine", when: "2–1 months out", body: "Adjust around fittings and pre-wedding events." },
  { name: "Maintain", when: "Final weeks", body: "Keep steady through the functions. Nothing new or drastic." },
];

const faqs = [
  { q: "How much does it cost?", a: "Tiers start at ₹18,000. The prices shown are indicative while we finalise the program with our clinical partners; founding members lock in founding pricing." },
  { q: "What happens to my deposit?", a: `The ${inr(site.depositInr)} deposit holds a founding spot and is adjusted against your program fee if you join. It is fully refundable on request, and we refund within ${site.refundDays} days. It is not a purchase of the program.` },
  { q: "Who are the doctors?", a: "We are finalising licensed clinical partners in your city. We will name them here only once they have confirmed in writing – until then: clinical partners announced soon." },
  { q: "Can my partner or wedding squad join?", a: "Yes. Couples can join together, and we plan to offer add-ons for close family and friends. Tell us on your call." },
  { q: "What data do you collect?", a: "Only your name, WhatsApp number, wedding month, area, tier of interest, who is getting married (optional), and how you found us. No health details at this stage." },
];

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ experiments, source }, params] = await Promise.all([visitorContext(), searchParams]);
  const now = new Date();

  const tiers: Tier[] = [
    { id: "silver", name: "Silver", price: `${inr(18000)} – ${inr(22000)}`, items: ["Core lab panel", "1 doctor consult", "Group nutrition plan", "Skincare consult"] },
    { id: "gold", name: "Gold", price: inr(goldPrice[experiments.price]), featured: true, items: ["Labs including hormone markers", "3 doctor consults", "Personal nutrition plan", "Dermatology plan", "1 medi-facial"] },
    { id: "platinum", name: "Platinum", price: `${inr(70000)} – ${inr(90000)}`, items: ["Extended lab panel", "A named senior doctor", "3 skin treatments", "Couple wellness session", "Concierge coach"] },
  ];

  return (
    <>
      <Header />
      <PageTracker />
      <main id="main">
        <section className="grid md:mx-auto md:max-w-6xl md:grid-cols-[1.1fr_0.9fr] md:grid-rows-[auto_auto] md:gap-x-8 md:px-5 md:pt-16 md:pb-20 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="relative [grid-area:1/1] h-[min(78svh,680px)] min-h-[480px] overflow-hidden bg-sand md:col-start-2 md:row-span-2 md:h-auto md:min-h-0 md:aspect-[4/5] md:self-center md:rounded-[2rem]">
            <Image src="/hero-couple.jpg" alt="An Indian bride and groom embracing under a floral mandap" fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-[52%_40%]" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent md:hidden" />
          </div>
          <div className="relative z-10 [grid-area:1/1] self-end px-5 pb-7 text-white md:col-start-1 md:row-start-1 md:px-0 md:pb-0 md:text-ink">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/85 uppercase md:text-sage">Launching soon · {site.city}</p>
            <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.05] font-medium sm:text-5xl md:mt-4 lg:whitespace-nowrap lg:text-[3.4rem]">
              Be well. Look well. <em className="text-[#d7e8dc] md:text-sage">Wed well.</em>
            </h1>
            <p className="mt-3 text-lg font-semibold md:mt-5 md:text-xl">{headline[experiments.message]}</p>
          </div>
          <div className="px-5 pt-6 pb-12 md:col-start-1 md:row-start-2 md:px-0 md:pt-3 md:pb-0">
            <p className="max-w-md text-lg leading-relaxed text-muted">
              A doctor-guided health and glow program for engaged couples. Begin 4–6 months before the wedding, so the glow on the day comes from real health, not last-minute fixes.
            </p>
            <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-sage-dark md:hidden">
              {["Doctor-guided", `${inr(site.depositInr)} refundable`, "Private & discreet"].map((t) => (
                <li key={t} className="rounded-2xl bg-sage-soft px-2 py-3 leading-snug">{t}</li>
              ))}
            </ul>
            <a href="#reserve" className="mt-7 hidden min-h-13 items-center rounded-full bg-sage px-8 text-base font-semibold text-white hover:bg-sage-dark md:inline-flex">
              Reserve your spot
            </a>
            <p className="mt-3 hidden text-sm text-muted md:block">Founding members only · Refundable {inr(site.depositInr)} deposit</p>
          </div>
        </section>

        <section id="idea" className="bg-paper py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl font-serif text-4xl font-medium">Health first. The glow follows.</h2>
            <p className="mt-3 max-w-2xl text-muted">Real change takes months, not days. Starting early lets your body and skin respond gently and lastingly.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.title} className="rounded-3xl bg-sage-soft p-6">
                  <h3 className="font-serif text-2xl font-semibold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-serif text-4xl font-medium">How it works</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.name} className="border-t-2 border-sage pt-4">
                  <p className="text-xs font-semibold tracking-widest text-sage uppercase">Step {i + 1} · {s.when}</p>
                  <h3 className="mt-1 font-serif text-3xl font-semibold">{s.name}</h3>
                  <p className="mt-2 text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="packages" className="bg-paper py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-serif text-4xl font-medium">Packages</h2>
            <p className="mt-3 max-w-2xl text-muted">Indicative prices for founding members. Final names and inclusions are confirmed with our clinical partners before launch.</p>
            <TierCards tiers={tiers} />
          </div>
        </section>

        <section id="team" className="py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
            <div className="rounded-3xl border border-line p-6">
              <h2 className="font-serif text-3xl font-medium">Who is behind it</h2>
              <p className="mt-3 leading-relaxed text-muted">
                WeddingWell will be delivered with licensed doctors and partner clinics in {site.city}. Clinical partners announced soon.
              </p>
            </div>
            <div className="rounded-3xl border border-line p-6">
              <h2 className="font-serif text-3xl font-medium">Private and discreet</h2>
              <p className="mt-3 leading-relaxed text-muted">
                Your health details stay between you and your care team. They are never shared with family, planners or in group chats.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-paper py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-serif text-4xl font-medium">Questions</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-lg font-semibold">
                    {f.q}
                    <span aria-hidden className="text-2xl text-sage transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="reserve" className="py-16 bg-paper">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="font-serif text-4xl font-medium">Reserve your founding spot</h2>
            <p className="mt-3 mb-8 text-muted">Takes under a minute. We&apos;ll confirm on WhatsApp.</p>
            <SignupFlow
              areas={[...areas]}
              monthMin={monthKey(now)}
              monthMax={monthKey(now, 24)}
              referral={source.ref ?? ""}
              commitmentVariant={experiments.commitment}
              deposit={inr(site.depositInr)}
              refundDays={site.refundDays}
              paymentsLive={paymentsEnabled()}
              depositReturned={params.deposit === "done"}
            />
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
