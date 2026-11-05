import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import { siteUrl } from "@/lib/config";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

const description =
  "A 4–6 month health and glow program for engaged couples, launching soon. Health first; the glow is the visible result. Reserve a founding spot.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "WeddingWell – Look and feel your best on the day",
  description,
  openGraph: { title: "WeddingWell – launching soon", description, images: ["/hero.jpg"], locale: "en_IN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f6f1ea", width: "device-width", initialScale: 1 };

const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const gtagId = GA || ADS;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
          Skip to content
        </a>
        {children}
        {gtagId && /^(G|AW)-[A-Z0-9]+$/.test(gtagId) ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
            <Script id="gtag" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());${GA ? `gtag('config','${GA}');` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}
            </Script>
          </>
        ) : null}
        {PIXEL && /^\d+$/.test(PIXEL) ? (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
