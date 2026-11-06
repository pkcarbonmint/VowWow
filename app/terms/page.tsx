import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service – WeddingWell" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p className="text-muted">Last updated: November 6, 2026</p>
      
      <p>
        Welcome to WeddingWell. These Terms of Service ("Terms") govern your use of our website 
        and services. By using our site, you agree to these Terms.
      </p>

      <h2>1. Service Description</h2>
      <p>
        WeddingWell is a pre-launch wellness program currently in development. We provide information 
        about upcoming health and wellness services for engaged couples in {site.city}.
      </p>
      <ul>
        <li>The service is currently in testing phase</li>
        <li>Program details are indicative and subject to change</li>
        <li>Final inclusions depend on clinical partner confirmations</li>
        <li>Nothing on this site constitutes medical advice</li>
      </ul>

      <h2>2. Account Registration</h2>
      <p>
        To access certain features, you may sign in using your Google account. When you sign in:
      </p>
      <ul>
        <li>You authorize us to access your basic profile information (name, email, profile picture)</li>
        <li>You must provide accurate and complete information</li>
        <li>You are responsible for maintaining the security of your account</li>
        <li>You must notify us immediately of any unauthorized access</li>
      </ul>

      <h2>3. Founding Member Deposits</h2>
      <p>
        The ₹{site.depositInr.toLocaleString("en-IN")} founding member deposit:
      </p>
      <ul>
        <li>Is <strong>not a purchase</strong> of the wellness program</li>
        <li>Holds a spot in the founding member waitlist</li>
        <li>Is fully refundable within {site.refundDays} days of your request, no questions asked</li>
        <li>May be adjusted against your program fee if you join when the program launches</li>
        <li>Does not guarantee program availability or specific pricing</li>
      </ul>
      <p>
        See our <a href="/refund" className="underline">Deposit & Refund Policy</a> for complete details.
      </p>

      <h2>4. Free Consultation Calls</h2>
      <p>
        If you book a free 15-minute consultation call:
      </p>
      <ul>
        <li>Calls are informational only and do not constitute medical advice</li>
        <li>We may reschedule or cancel with reasonable notice</li>
        <li>You can cancel anytime before your scheduled time</li>
        <li>Call recordings may be used for quality assurance</li>
      </ul>

      <h2>5. Acceptable Use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>Provide false or misleading information</li>
        <li>Use automated tools to access or scrape our site</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Spam our communication channels</li>
        <li>Violate any applicable laws or regulations</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        All content on this website (text, graphics, logos, images) is owned by {site.businessName} 
        or our licensors and protected by copyright and trademark laws.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>Our website uses third-party services:</p>
      <ul>
        <li><strong>Google OAuth:</strong> For secure sign-in (governed by Google's Terms)</li>
        <li><strong>Razorpay:</strong> For payment processing (governed by Razorpay's Terms)</li>
        <li><strong>WhatsApp:</strong> For messaging (governed by WhatsApp's Terms)</li>
        <li><strong>Vercel:</strong> For hosting</li>
      </ul>
      <p>
        We are not responsible for third-party services. Your use of these services is subject 
        to their respective terms and policies.
      </p>

      <h2>8. Disclaimers</h2>
      <p><strong>No Medical Advice:</strong></p>
      <ul>
        <li>Nothing on this website is medical advice or diagnosis</li>
        <li>Always consult qualified healthcare professionals for medical decisions</li>
        <li>We do not replace professional medical care</li>
      </ul>

      <p><strong>Program Availability:</strong></p>
      <ul>
        <li>WeddingWell is a program in development</li>
        <li>Availability, features, and pricing may change</li>
        <li>Clinical partners must confirm before we launch</li>
        <li>We reserve the right not to launch or to cancel the program</li>
      </ul>

      <p><strong>No Warranties:</strong></p>
      <p>
        Our website and information are provided "as is" without warranties of any kind, 
        express or implied. We do not guarantee accuracy, completeness, or fitness for any purpose.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {site.businessName} shall not be liable for:
      </p>
      <ul>
        <li>Any indirect, incidental, or consequential damages</li>
        <li>Loss of data, revenue, or profits</li>
        <li>Service interruptions or technical issues</li>
        <li>Third-party actions or content</li>
      </ul>
      <p>
        Our total liability to you shall not exceed the amount you paid us (your deposit, if any).
      </p>

      <h2>10. Refund Policy</h2>
      <p>
        Deposits are fully refundable within {site.refundDays} days of request. 
        See our <a href="/refund" className="underline">complete refund policy</a>.
      </p>

      <h2>11. Privacy</h2>
      <p>
        Your privacy is important to us. See our <a href="/privacy" className="underline">Privacy Notice</a> 
        for how we collect, use, and protect your personal data under India's Digital Personal Data Protection Act, 2023.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Changes take effect when posted. 
        Continued use of our site after changes means you accept the new Terms.
      </p>

      <h2>13. Termination</h2>
      <p>
        We may suspend or terminate your access at any time for:
      </p>
      <ul>
        <li>Violation of these Terms</li>
        <li>Fraudulent or illegal activity</li>
        <li>At our sole discretion</li>
      </ul>
      <p>
        You may stop using our services at any time. Withdrawal rights are explained in our 
        Privacy Notice and Refund Policy.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the 
        exclusive jurisdiction of courts in {site.city}, India.
      </p>

      <h2>15. Contact</h2>
      <p>
        For questions about these Terms, contact:
      </p>
      <p>
        {site.grievanceOfficer}<br/>
        {site.businessName}<br/>
        {site.address}<br/>
        Email: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>16. Severability</h2>
      <p>
        If any provision of these Terms is found invalid or unenforceable, the remaining 
        provisions shall continue in full force and effect.
      </p>

      <h2>17. Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Notice and Refund Policy, constitute the 
        entire agreement between you and {site.businessName} regarding use of our services.
      </p>
    </LegalPage>
  );
}
