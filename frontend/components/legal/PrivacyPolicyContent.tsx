import Link from 'next/link';

export default function PrivacyPolicyContent() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
        <p className="leading-relaxed mb-4">
          Welcome to TestiFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring you
          have a positive experience on our website and when using our products and services.
        </p>
        <p className="leading-relaxed">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
          website and use our testimonial collection and management platform (the &quot;Service&quot;).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.1 Information You Provide</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Account information (name, email address, password or OAuth identifiers)</li>
          <li>Billing-related identifiers as processed by our payment provider (we do not store full card numbers on our servers)</li>
          <li>Testimonial content and related metadata you or your customers submit</li>
          <li>Communications when you contact us</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.2 Automatically Collected Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Usage data and product analytics</li>
          <li>Device information and browser type</li>
          <li>IP address and approximate location derived from network data</li>
          <li>Cookies and similar technologies where applicable</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
        <p className="leading-relaxed mb-3">We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve the Service</li>
          <li>Process subscriptions and send related transactional messages</li>
          <li>Respond to your requests and provide support</li>
          <li>Monitor usage, secure our systems, and detect abuse</li>
          <li>Comply with legal obligations and enforce our terms</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">4. Legal Bases (where applicable)</h2>
        <p className="leading-relaxed">
          Where required by law (for example in the EEA or UK), we process personal data on the basis of contract
          performance, legitimate interests (such as security and product improvement), consent where requested, and legal
          obligation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">5. Sharing and Disclosure</h2>
        <p className="leading-relaxed mb-3">We do not sell your personal information. We may share information with:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Service providers</strong> who host infrastructure, send email, or provide analytics, under contractual
            obligations to protect data
          </li>
          <li>
            <strong>Payment processors</strong> (e.g. Lemon Squeezy) that handle checkout, subscriptions, and tax where
            applicable—their privacy policy also applies to payment data they process
          </li>
          <li>Professional advisers, regulators, or law enforcement when required by law</li>
          <li>A successor entity in a merger, acquisition, or asset sale, subject to appropriate safeguards</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">6. International Transfers</h2>
        <p className="leading-relaxed">
          Your information may be processed in countries other than your own. Where we transfer personal data across
          borders, we use appropriate safeguards as required by applicable law.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">7. Retention</h2>
        <p className="leading-relaxed">
          We retain personal information for as long as your account is active, as needed to provide the Service, and as
          necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">8. Security</h2>
        <p className="leading-relaxed">
          We implement appropriate technical and organizational measures designed to protect your information. No method of
          transmission or storage is 100% secure; we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">9. Your Rights</h2>
        <p className="leading-relaxed mb-3">
          Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain
          processing, and to data portability or to withdraw consent. To exercise these rights, contact us using the details
          below. You may also lodge a complaint with a supervisory authority where applicable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">10. Cookies &amp; Similar Technologies</h2>
        <p className="leading-relaxed">
          We may use cookies and similar technologies for authentication, preferences, security, and analytics. You can
          control cookies through your browser settings; disabling some cookies may affect functionality.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">11. Children&apos;s Privacy</h2>
        <p className="leading-relaxed">
          The Service is not directed to individuals under 16 (or the age required in your jurisdiction). We do not knowingly
          collect personal information from children.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">12. Changes to This Policy</h2>
        <p className="leading-relaxed">
          We may update this Privacy Policy from time to time. We will post the updated policy on this page and revise the
          &quot;Last updated&quot; date. Material changes may be communicated by email or in-product notice where appropriate.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">13. Contact</h2>
        <p className="leading-relaxed">
          Questions about this Privacy Policy:{' '}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact us
          </Link>{' '}
          or email{' '}
          <a href="mailto:apdevstudion@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            apdevstudion@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
