'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function CollectPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  useEffect(() => {
    const base = window.location.origin;
    const existing = document.getElementById('testiflow-collect-script');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'testiflow-collect-script';
    script.src = `${base}/embed.js`;
    script.setAttribute('data-site-id', siteId);
    script.async = true;
    document.body.appendChild(script);
  }, [siteId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-md text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Share your experience</h1>
        <p className="text-gray-600 text-sm">
          Use the button below to leave a video or text testimonial. Thank you!
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-auto pb-4">Powered by TestiFlow</p>
    </div>
  );
}
