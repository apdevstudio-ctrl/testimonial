import Link from 'next/link';

export default function TermsOfServiceContent() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. Agreement</h2>
        <p className="leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of TestiFlow (the &quot;Service&quot;), operated by us. By
          creating an account, accessing, or using the Service, you agree to these Terms. If you do not agree, do not use the
          Service.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
        <p className="leading-relaxed mb-3">
          TestiFlow provides tools to collect, manage, and display customer testimonials, including widgets, dashboards, and
          related features. We may modify, suspend, or discontinue features with reasonable notice where practicable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. Accounts &amp; Eligibility</h2>
        <p className="leading-relaxed mb-3">You agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate, current, and complete registration information</li>
          <li>Maintain the confidentiality of your credentials and accept responsibility for activity under your account</li>
          <li>Notify us promptly of unauthorized access</li>
          <li>Be at least the age of majority in your jurisdiction (or have parental consent where required)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">4. Trials, Subscriptions &amp; Billing</h2>
        <p className="leading-relaxed mb-3">
          We may offer free trials or paid plans. Fees, renewal periods, and taxes are presented at checkout and managed by
          our third-party payment provider (currently Lemon Squeezy). By purchasing, you authorize charges according to the
          plan you select until you cancel in accordance with the provider&apos;s and our cancellation flows. You are responsible
          for maintaining valid payment information.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fees are generally non-refundable except as required by law or as stated at purchase</li>
          <li>We may change pricing with reasonable advance notice; changes apply on renewal where applicable</li>
          <li>Failure to pay may result in suspension or termination of access after any grace period offered by the processor</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">5. Acceptable Use</h2>
        <p className="leading-relaxed mb-3">You will not, and will not permit others to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violate applicable laws or third-party rights</li>
          <li>Upload malware, scrape the Service in an abusive way, or attempt unauthorized access</li>
          <li>Use the Service to send spam, harass others, or collect data from end users without a lawful basis and clear notice</li>
          <li>Misrepresent testimonials or impersonate individuals or organizations</li>
          <li>Reverse engineer the Service except where permitted by law</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">6. Customer Content &amp; License</h2>
        <p className="leading-relaxed mb-3">
          You retain rights to content you submit (&quot;Customer Content&quot;). You grant us a worldwide, non-exclusive license to
          host, process, transmit, and display Customer Content solely to provide and improve the Service and as directed by
          you (for example, displaying widgets on your properties). You represent that you have all rights and consents
          needed for us to process Customer Content, including testimonials from your customers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">7. Intellectual Property</h2>
        <p className="leading-relaxed">
          The Service, including software, branding, and documentation, is owned by us and our licensors and is protected
          by intellectual property laws. Except for the limited rights expressly granted in these Terms, no rights are
          transferred to you.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">8. Third-Party Services</h2>
        <p className="leading-relaxed">
          The Service may integrate with or link to third-party services (including payment, hosting, and analytics). Your use
          of those services is subject to their respective terms and privacy policies. We are not responsible for third-party
          services.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">9. Disclaimer of Warranties</h2>
        <p className="leading-relaxed">
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR
          STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT,
          TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">10. Limitation of Liability</h2>
        <p className="leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS OPPORTUNITY,
          ARISING OUT OF OR RELATED TO THE SERVICE OR THESE TERMS, EVEN IF ADVISED OF THE POSSIBILITY. OUR AGGREGATE LIABILITY
          FOR ALL CLAIMS RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF AMOUNTS YOU PAID US FOR THE SERVICE IN THE
          TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY OR ONE HUNDRED U.S. DOLLARS (US$100), EXCEPT WHERE
          LIABILITY CANNOT BE LIMITED BY LAW.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">11. Indemnity</h2>
        <p className="leading-relaxed">
          You will defend, indemnify, and hold harmless us and our affiliates, officers, and employees from any claims,
          damages, losses, and expenses (including reasonable attorneys&apos; fees) arising from your Customer Content, your use
          of the Service in violation of these Terms, or your violation of applicable law or third-party rights.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">12. Suspension &amp; Termination</h2>
        <p className="leading-relaxed">
          We may suspend or terminate access for breach of these Terms, risk to security or others, or non-payment. You may
          stop using the Service at any time. Provisions that by their nature should survive will survive termination
          (including ownership, warranty disclaimers, limitation of liability, and indemnity).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">13. Governing Law &amp; Disputes</h2>
        <p className="leading-relaxed">
          These Terms are governed by the laws of the jurisdiction in which we operate the Service from, without regard to
          conflict-of-law rules, except where mandatory consumer protections in your country apply. Courts in that jurisdiction
          have exclusive venue, unless applicable law requires otherwise. Before filing a claim, you agree to contact us to
          attempt informal resolution.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">14. Severability &amp; Entire Agreement</h2>
        <p className="leading-relaxed">
          If any provision is held unenforceable, the remaining provisions remain in effect. These Terms, together with
          policies referenced herein (including the Privacy Policy), constitute the entire agreement between you and us
          regarding the Service and supersede prior agreements on the subject.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">15. Changes to These Terms</h2>
        <p className="leading-relaxed">
          We may modify these Terms from time to time. We will post the updated Terms on this page and update the &quot;Last
          updated&quot; date. If changes are material, we may provide additional notice (such as email or in-app notice). Continued
          use after the effective date constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">16. Contact</h2>
        <p className="leading-relaxed">
          Questions about these Terms:{' '}
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

      <p className="text-sm text-gray-500 dark:text-slate-500 border-t border-gray-200 dark:border-slate-700 pt-6">
        <strong>General notice:</strong> These documents are provided as a practical template and are not tailored legal
        advice. Have qualified counsel review them for your jurisdiction, industry, and data practices.
      </p>
    </div>
  );
}
