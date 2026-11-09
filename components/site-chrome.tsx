import Link from "next/link";
import { site } from "@/lib/config";
import { Wordmark } from "./brand";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-sage-soft/60 bg-ivory/95 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-6">
        <Link href="/" aria-label="WeddingWell home" className="hover:opacity-80 transition-opacity duration-300">
          <Wordmark className="text-2xl md:text-3xl" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/#reserve" className="hidden min-h-12 items-center rounded-full bg-gradient-to-r from-sage to-sage-bright px-6 text-sm font-bold text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 md:inline-flex">
            Reserve your spot
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sage-soft/60 bg-gradient-to-b from-sand to-ivory pb-28 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-6 py-14 text-sm text-muted md:grid-cols-3">
        <div>
          <Wordmark className="text-3xl text-ink" />
          <p className="mt-3 leading-relaxed font-medium">Launching soon in {site.city}. Founding members only.</p>
        </div>
        <div className="leading-relaxed">
          <p className="font-bold text-ink text-base">{site.businessName}</p>
          <p className="mt-2">{site.address}</p>
          <p className="mt-3">
            {site.grievanceOfficer}: <a className="underline hover:text-sage-bright transition-colors duration-300 font-semibold" href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <nav aria-label="Legal" className="flex flex-col gap-3">
          <Link href="/terms" className="underline hover:text-sage-bright transition-colors duration-300 font-semibold">Terms of Service</Link>
          <Link href="/privacy" className="underline hover:text-sage-bright transition-colors duration-300 font-semibold">Privacy notice &amp; data requests</Link>
          <Link href="/refund" className="underline hover:text-sage-bright transition-colors duration-300 font-semibold">Deposit &amp; refund policy</Link>
          <p className="mt-4 text-xs leading-relaxed">
            WeddingWell is a wellness program in development. Nothing on this page is medical advice or a promise of a specific result.
          </p>
        </nav>
      </div>
    </footer>
  );
}
