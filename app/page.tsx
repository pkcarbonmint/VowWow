import Image from "next/image";
import { redirect } from "next/navigation";
import { PageTracker } from "@/components/page-tracker";
import { SignupFlow } from "@/components/signup-flow";
import { Footer, Header } from "@/components/site-chrome";
import { StickyCta } from "@/components/sticky-cta";
import { TierCards, type Tier } from "@/components/tier-cards";
import { AiChat } from "@/components/ai-chat";
import { areas, site } from "@/lib/config";
import { goldPrice, headline } from "@/lib/experiments";
import { visitorContext } from "@/lib/server/context";
import { paymentsEnabled } from "@/lib/server/razorpay";
import { auth } from "@/auth";

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
  const [{ experiments, source }, params, session] = await Promise.all([visitorContext(), searchParams, auth()]);
  
  // Redirect logged-in users to their resources hub
  if (session?.user) {
    redirect('/resources');
  }
  
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
        <section className="grid md:mx-auto md:max-w-7xl md:grid-cols-[1.1fr_0.9fr] md:grid-rows-[auto_auto] md:gap-x-12 md:px-6 md:pt-20 md:pb-24 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="relative [grid-area:1/1] h-[min(78svh,680px)] min-h-[480px] overflow-hidden bg-sand md:col-start-2 md:row-span-2 md:h-auto md:min-h-0 md:aspect-[4/5] md:self-center md:rounded-[2.5rem] md:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <Image src="/hero-couple.jpg" alt="An Indian bride and groom embracing under a floral mandap" fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-[52%_25%]" />
            <div aria-hidden className="hero-gradient absolute inset-0 md:hidden" />
          </div>
          <div className="relative z-10 [grid-area:1/1] self-end px-5 pb-8 text-white md:col-start-1 md:row-start-1 md:px-0 md:pb-0 md:text-ink animate-fade-in">
            <p className="text-xs font-bold tracking-[0.25em] text-white/90 uppercase md:text-sage-bright">Launching soon · {site.city}</p>
            <h1 className="mt-4 font-serif text-[3rem] leading-[0.95] font-semibold sm:text-6xl md:mt-6 lg:text-[4.2rem] tracking-tight">
              Be well. Look well. <em className="gradient-text block mt-2 md:inline md:mt-0 not-italic">Wed well.</em>
            </h1>
            <p className="mt-4 text-xl font-bold md:mt-6 md:text-2xl leading-tight">{headline[experiments.message]}</p>
          </div>
          <div className="px-5 pt-7 pb-12 md:col-start-1 md:row-start-2 md:px-0 md:pt-4 md:pb-0 animate-on-scroll">
            <p className="max-w-lg text-lg leading-relaxed text-muted md:text-xl">
              A doctor-guided health and glow program for engaged couples. Begin 4–6 months before the wedding, so the glow on the day comes from real health, not last-minute fixes.
            </p>
            <ul className="mt-7 grid grid-cols-3 gap-2.5 text-center text-xs font-bold text-sage-dark md:hidden">
              {["Doctor-guided", `${inr(site.depositInr)} refundable`, "Private & discreet"].map((t) => (
                <li key={t} className="rounded-2xl bg-sage-soft px-2 py-3.5 leading-snug shadow-sm">{t}</li>
              ))}
            </ul>
            <a href="#reserve" className="mt-8 hidden min-h-14 items-center rounded-full bg-gradient-to-r from-sage to-sage-bright px-10 text-base font-bold text-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 md:inline-flex">
              Reserve your spot
            </a>
            <p className="mt-4 hidden text-sm text-muted md:block font-semibold">Founding members only · Refundable {inr(site.depositInr)} deposit</p>
          </div>
        </section>

        <section id="idea" className="bg-gradient-to-b from-paper to-ivory py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <h2 className="max-w-3xl font-serif text-5xl md:text-6xl font-semibold tracking-tight leading-tight">Health first. The glow follows.</h2>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted leading-relaxed">Real change takes months, not days. Starting early lets your body and skin respond gently and lastingly.</p>
            <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
              {pillars.map((p, i) => (
                <div key={p.title} className={`rounded-3xl bg-gradient-to-br from-sage-soft to-white p-8 shadow-[0_8px_30px_rgba(45,102,83,0.08)] card-hover border border-sage-soft/50 animate-on-scroll${i > 0 ? `-delay-${i}` : ''}`}>
                  <h3 className="font-serif text-3xl font-bold text-sage-dark">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted text-[15px]">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="py-20 bg-ivory">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.name} className={`border-t-3 border-sage-bright pt-5 group animate-on-scroll${i > 0 ? `-delay-${Math.min(i, 2)}` : ''}`}>
                  <p className="text-xs font-bold tracking-[0.2em] text-sage-bright uppercase">Step {i + 1} · {s.when}</p>
                  <h3 className="mt-2 font-serif text-4xl font-bold text-ink group-hover:text-sage-bright transition-colors duration-300">{s.name}</h3>
                  <p className="mt-3 text-muted leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="packages" className="bg-gradient-to-b from-paper via-ivory to-paper py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">Packages</h2>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted leading-relaxed">Indicative prices for founding members. Final names and inclusions are confirmed with our clinical partners before launch.</p>
            <TierCards tiers={tiers} />
          </div>
        </section>

        <section id="team" className="py-20 bg-ivory">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 md:px-6 md:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-gold-soft to-white border border-gold/20 p-8 shadow-[0_8px_30px_rgba(212,165,116,0.1)] card-hover">
              <h2 className="font-serif text-4xl font-bold text-ink">Who is behind it</h2>
              <p className="mt-4 leading-relaxed text-muted text-[15px]">
                WeddingWell will be delivered with licensed doctors and partner clinics in {site.city}. Clinical partners announced soon.
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-sage-soft to-white border border-sage/20 p-8 shadow-[0_8px_30px_rgba(45,102,83,0.1)] card-hover">
              <h2 className="font-serif text-4xl font-bold text-ink">Private and discreet</h2>
              <p className="mt-4 leading-relaxed text-muted text-[15px]">
                Your health details stay between you and your care team. They are never shared with family, planners or in group chats.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-gradient-to-b from-paper to-ivory py-20">
          <div className="mx-auto max-w-4xl px-5 md:px-6">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">Questions</h2>
            <div className="mt-10 divide-y divide-line/50 border-y border-line/50">
              {faqs.map((f) => (
                <details key={f.q} className="group py-6 hover:bg-sage-soft/30 transition-colors duration-300 px-4 -mx-4 rounded-2xl">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 text-xl font-bold text-ink group-hover:text-sage-bright transition-colors duration-300">
                    {f.q}
                    <span aria-hidden className="text-3xl text-sage-bright transition-transform duration-300 group-open:rotate-45 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-muted text-[15px] pr-12">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-chat" className="py-20 bg-ivory">
          <div className="mx-auto max-w-4xl px-5 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">Get personalized advice</h2>
              <p className="mt-4 text-lg md:text-xl text-muted">
                Free AI assistant for health, skincare, and wellness planning
              </p>
            </div>
            <AiChat />
            <p className="mt-6 text-center text-sm text-muted font-medium leading-relaxed max-w-2xl mx-auto">
              💡 I specialize in skincare, health, nutrition, fitness, and beauty timelines. For wedding planning (venues, outfits), check TheKnot or WedMeGood.
            </p>
          </div>
        </section>

        <section id="reserve" className="py-20 bg-gradient-to-b from-paper to-ivory">
          <div className="mx-auto max-w-2xl px-5 md:px-6">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight text-center">Reserve your founding spot</h2>
            <p className="mt-5 mb-12 text-lg md:text-xl text-muted text-center leading-relaxed">Takes under a minute. We&apos;ll confirm on WhatsApp.</p>
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
              userEmail={session?.user?.email ?? undefined}
              userName={session?.user?.name ?? undefined}
              userId={session?.user?.id ?? undefined}
            />
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
