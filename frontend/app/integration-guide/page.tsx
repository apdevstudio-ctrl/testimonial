'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Code,
  FileText,
  Settings,
  AlertCircle,
  BookOpen,
  Layout,
  Layers,
  ExternalLink,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  FEATURES_LIST,
  scriptCollect,
  declarativeWall,
  wallIframe,
  reactExample,
  LAYOUTS,
  THEMES,
} from '@/lib/docs/integrationGuideContent';

function CodeBlock({
  code,
  id,
  copiedSection,
  onCopy,
}: {
  code: string;
  id: string;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}) {
  return (
    <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4 relative">
      <code className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-all block pr-10">
        {code}
      </code>
      <Button
        onClick={() => onCopy(code, id)}
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
      >
        {copiedSection === id ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default function IntegrationGuidePage() {
  const { showToast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://testiflow.site';
  const exampleSiteId = 'your-site-id-here';

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const cspMetaTag = `<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline' ${baseUrl} https://cdn.jsdelivr.net; 
               connect-src 'self' ${baseUrl}; 
               frame-src ${baseUrl};">`;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Integration Guide</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Everything TestiFlow provides and how to embed it on your website.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/getting-started">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Online docs
            </Button>
          </Link>
          <Link href="/integrations">
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Platform guides
            </Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline self-center"
          >
            See also INTEGRATION_GUIDE.md in the repo root
          </a>
        </div>
      </div>

      {/* Features */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Features included</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES_LIST.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{group.title}</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Collect */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Collect testimonials</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Paste before <code className="bg-gray-100 px-2 py-1 rounded">&lt;/body&gt;</code>.
          Button, modal/drawer, and form are configured in the dashboard.
        </p>
        <CodeBlock
          code={scriptCollect(exampleSiteId, baseUrl)}
          id="collect"
          copiedSection={copiedSection}
          onCopy={copyToClipboard}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Collect link:{' '}
          <code className="bg-gray-100 px-1 rounded">
            {baseUrl}/collect/{exampleSiteId}
          </code>
        </p>
      </Card>

      {/* Display declarative */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Layout className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Display — Wall of Love (declarative)</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Recommended. Auto-renders published testimonials. Publish them in the dashboard first.
        </p>
        <CodeBlock
          code={declarativeWall(exampleSiteId, baseUrl)}
          id="wall-declarative"
          copiedSection={copiedSection}
          onCopy={copyToClipboard}
        />
        <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">Layouts</p>
            <p className="text-gray-600 dark:text-gray-400">{LAYOUTS.join(', ')}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">Themes</p>
            <p className="text-gray-600 dark:text-gray-400">{THEMES.join(', ')}</p>
          </div>
        </div>
      </Card>

      {/* Iframe wall */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Display — Iframe (WordPress, Webflow)</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Auto-resizing iframe. Also available in dashboard → <strong>Embed Studio</strong>.
        </p>
        <CodeBlock
          code={wallIframe(exampleSiteId, baseUrl)}
          id="wall-iframe"
          copiedSection={copiedSection}
          onCopy={copyToClipboard}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Public SEO page:{' '}
          <code className="bg-gray-100 px-1 rounded">{baseUrl}/w/your-public-slug</code>
        </p>
      </Card>

      {/* React */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. React / Next.js</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Package: <code className="bg-gray-100 px-1 rounded">@testiflow/react</code> (see{' '}
          <code className="bg-gray-100 px-1 rounded">packages/react</code> in repo)
        </p>
        <CodeBlock
          code={reactExample(exampleSiteId)}
          id="react"
          copiedSection={copiedSection}
          onCopy={copyToClipboard}
        />
        <Link href="/integrations/nextjs" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline inline-flex items-center mt-2">
          Next.js integration page <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </Card>

      {/* Dashboard config */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard configuration</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Customize in the app — not in embed code:</p>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li>• <strong>Embed Studio</strong> — copy all snippet types</li>
          <li>• <strong>Configuration</strong> — button, flow type, Wall of Love slug & layout</li>
          <li>• <strong>Theme</strong> — colors, fonts, border radius</li>
          <li>• <strong>Builder</strong> — form fields & display component</li>
          <li>• <strong>Testimonials</strong> — approve & publish before they appear on site</li>
          <li>• <strong>Analytics</strong> — views, clicks, submissions, wall views</li>
        </ul>
      </Card>

      {/* API */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">API endpoints</h2>
        </div>
        <div className="text-sm font-mono text-gray-800 dark:text-gray-200 space-y-2 bg-gray-50 dark:bg-slate-950 p-4 rounded-lg">
          <p>GET /api/public/walls/&#123;slug&#125; — public wall JSON</p>
          <p>GET /api/testimonials?siteId= — published testimonials</p>
          <p>GET /api/config/&#123;siteId&#125; — widget config</p>
          <p>POST /api/analytics/events — track wall_view, button_click, etc.</p>
          <p>POST /api/ai/enrich — AI summary & tags (auth required)</p>
        </div>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Troubleshooting</h2>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">CSP blocked?</h3>
            <CodeBlock code={cspMetaTag} id="csp" copiedSection={copiedSection} onCopy={copyToClipboard} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Testimonials not showing?</h3>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Publish testimonials in dashboard (not draft)</li>
              <li>Check site ID matches your account</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">embed.js</code> (not only legacy script.js)</li>
            </ol>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Iframe height wrong?</h3>
            <p className="text-gray-700 dark:text-gray-300">Use iframe-resizer snippet from Embed Studio — avoid fixed 800px height.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
