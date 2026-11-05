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
        <section className="mx-auto grid max-w-6xl gap-8 px-5 pt-8 pb-14 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.35fr_0.85fr] md:items-center md:pt-16 md:pb-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sage uppercase">Launching soon · {site.city}</p>
            <h1 className="mt-4 font-serif text-[2.5rem] leading-[1.08] font-medium sm:text-5xl lg:whitespace-nowrap lg:text-[3.4rem]">
              Be well. Look well. <em className="text-sage">Wed well.</em>
            </h1>
            <p className="mt-5 text-xl font-semibold text-ink">{headline[experiments.message]}</p>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-muted">
              A doctor-guided health and glow program for engaged couples. Begin 4–6 months before the wedding, so the glow on the day comes from real health, not last-minute fixes.
            </p>
            <a href="#reserve" className="mt-7 inline-flex min-h-13 items-center rounded-full bg-sage px-8 text-base font-semibold text-white hover:bg-sage-dark">
              Reserve your spot
            </a>
            <p className="mt-3 text-sm text-muted">Founding members only · Refundable {inr(site.depositInr)} deposit</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand">
            <Image src="/hero-couple.jpg" alt="An Indian bride and groom embracing under a floral mandap" fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-[52%_50%]" />
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

        <section id="reserve" className="py-16">
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
