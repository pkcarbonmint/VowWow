import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { PrivacyRequest } from "@/components/privacy-request";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy notice – WeddingWell" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy notice">
      <p>This notice explains how {site.businessName} handles your personal data under India&apos;s Digital Personal Data Protection Act, 2023.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Name, WhatsApp number, wedding month, city and area, tier of interest</li>
        <li>Optionally, who is getting married and a referral code</li>
        <li>How you reached us (ad campaign, referral link), which page version you saw, and when you gave consent</li>
      </ul>
      <p>We do not collect any health information on this page.</p>
      <h2>Why</h2>
      <p>To contact you on WhatsApp about WeddingWell, to hold a founding spot or book a call if you ask us to, and to understand which channels and messages work. We do not sell your data.</p>
      <h2>Who can see it</h2>
      <p>Only named members of the WeddingWell team, plus the service providers we use to run this page (hosting, spreadsheet, WhatsApp messaging and Razorpay for payments).</p>
      <h2>How long we keep it</h2>
      <p>If you do not join the waitlist or the program, we delete or anonymise your details after this pre-launch test ends.</p>
      <h2>Your rights</h2>
      <p>You can withdraw consent, ask for a copy, correction or deletion of your data at any time. Reply STOP on WhatsApp to stop messages immediately. We act on requests within {site.deletionDays} days.</p>
      <PrivacyRequest />
      <h2>Grievance officer</h2>
      <p>{site.grievanceOfficer}, {site.businessName}, {site.address}. Email: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
    </LegalPage>
  );
}
