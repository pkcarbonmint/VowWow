import Link from "next/link";
import { site } from "@/lib/config";
import { Wordmark } from "./brand";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="WeddingWell home">
          <Wordmark className="text-2xl" />
        </Link>
        <Link href="/#reserve" className="hidden min-h-11 items-center rounded-full bg-sage px-5 text-sm font-semibold text-white hover:bg-sage-dark md:inline-flex">
          Reserve your spot
        </Link>
        <span className="text-xs font-semibold tracking-widest text-sage uppercase md:hidden">Launching soon</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-sand/50 pb-28 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm text-muted md:grid-cols-3">
        <div>
          <Wordmark className="text-2xl text-ink" />
          <p className="mt-2 leading-relaxed">Launching soon in {site.city}. Founding members only.</p>
        </div>
        <div className="leading-relaxed">
          <p className="font-semibold text-ink">{site.businessName}</p>
          <p>{site.address}</p>
          <p className="mt-2">
            {site.grievanceOfficer}: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <nav aria-label="Legal" className="flex flex-col gap-2">
          <Link href="/privacy" className="underline">Privacy notice &amp; data requests</Link>
          <Link href="/refund" className="underline">Deposit &amp; refund policy</Link>
          <p className="mt-2 text-xs leading-relaxed">
            WeddingWell is a wellness program in development. Nothing on this page is medical advice or a promise of a specific result.
          </p>
        </nav>
      </div>
    </footer>
  );
}
