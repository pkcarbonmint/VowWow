import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Deposit & refund policy – WeddingWell" };

export default function Refund() {
  const amount = `₹${site.depositInr.toLocaleString("en-IN")}`;
  return (
    <LegalPage title="Deposit & refund policy">
      <p>
        <strong className="text-ink">The {amount} founding deposit is fully refundable, for any reason, and we refund it within {site.refundDays} days of your request.</strong>
      </p>
      <h2>What the deposit secures</h2>
      <ul>
        <li>A founding-member place in the first WeddingWell cohort in {site.city}</li>
        <li>Founding-member pricing on the tier you choose</li>
        <li>Priority scheduling for your first consult</li>
      </ul>
      <p>The deposit is not a purchase of the program or of any medical service. If you join, it is adjusted against your program fee. If the program does not launch, we refund every deposit automatically.</p>
      <h2>How to get a refund</h2>
      <p>Reply on WhatsApp or email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>. The refund goes back to your original payment method through Razorpay.</p>
      <h2>Who takes the payment</h2>
      <p>Deposits are collected by {site.businessName} through Razorpay, an RBI-authorised payment aggregator. We never see or store your card or UPI details.</p>
    </LegalPage>
  );
}
