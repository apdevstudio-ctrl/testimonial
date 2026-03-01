'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/landing" className="flex-shrink-0">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TestiFlow
              </div>
            </Link>
            <Link href="/landing">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-600 dark:text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                By accessing and using TestiFlow (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
                TestiFlow provides a platform for collecting, managing, and displaying customer testimonials. The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li>Testimonial collection tools and widgets</li>
                <li>Testimonial management dashboard</li>
                <li>Customization and branding options</li>
                <li>Analytics and reporting features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Collect or store personal data about other users</li>
                <li>Use the Service for any fraudulent or illegal purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Payment Terms</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
                If you purchase a paid subscription:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                <li>You agree to pay all fees associated with your subscription</li>
                <li>Fees are billed in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to change our pricing with 30 days notice</li>
                <li>You may cancel your subscription at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by TestiFlow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                You retain ownership of any content you submit through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with providing the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Termination</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                To the maximum extent permitted by law, TestiFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Contact Information</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  our contact page
                </Link>
                {' '}or email us at{' '}
                <a href="mailto:apdevstudion@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  apdevstudion@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

