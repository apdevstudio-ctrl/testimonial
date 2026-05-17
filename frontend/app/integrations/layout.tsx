import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations',
};

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/landing" className="font-semibold text-gray-900">
            TestiFlow
          </a>
          <div className="flex gap-4 text-sm">
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="/signup" className="text-indigo-600 font-medium hover:text-indigo-700">
              Sign up
            </a>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
