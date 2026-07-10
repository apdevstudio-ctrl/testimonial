'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, ExternalLink, Code2, Layout, MessageSquare } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { WIDGET_THEME_LIST, type WidgetThemePreset } from '@/lib/widgetThemes';
import {
  getScriptEmbed,
  getWallIframeEmbed,
  getCollectIframeEmbed,
  getDisplayScriptEmbed,
  getPublicWallUrl,
  getCollectUrl,
} from '@/lib/embed/snippets';

interface EmbedStudioProps {
  siteId: string;
  publicSlug?: string;
  flowType: 'modal' | 'drawer' | 'page';
}

type EmbedTab = 'collect' | 'wall' | 'display';

export default function EmbedStudio({ siteId, publicSlug, flowType }: EmbedStudioProps) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<EmbedTab>('collect');
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<WidgetThemePreset>('saas');
  const [layout, setLayout] = useState<'grid' | 'carousel' | 'marquee' | 'list'>('grid');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://testiflow.site';
  const slug = publicSlug || siteId;

  const code = useMemo(() => {
    const opts = { baseUrl, siteId, theme, layout };
    if (tab === 'collect') {
      return flowType === 'page' ? getCollectIframeEmbed(opts) : getScriptEmbed(opts);
    }
    if (tab === 'wall') return getWallIframeEmbed(opts);
    return getDisplayScriptEmbed(opts);
  }, [tab, baseUrl, siteId, theme, layout, flowType]);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Embed code copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: EmbedTab; label: string; icon: typeof Code2 }[] = [
    { id: 'collect', label: 'Collect', icon: MessageSquare },
    { id: 'wall', label: 'Wall of Love', icon: Layout },
    { id: 'display', label: 'Display only', icon: Code2 },
  ];

  return (
    <Card className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Embed Studio</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Copy snippets with auto-resizing iframe support</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href={getPublicWallUrl(baseUrl, slug)} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Public wall
            </Button>
          </a>
          <a href={getCollectUrl(baseUrl, siteId)} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Collect link
            </Button>
          </a>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg mb-4">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {(tab === 'wall' || tab === 'display') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as WidgetThemePreset)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            >
              {WIDGET_THEME_LIST.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Layout</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as typeof layout)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            >
              <option value="grid">Grid</option>
              <option value="carousel">Carousel</option>
              <option value="marquee">Marquee</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>
      )}

      {tab === 'wall' && (
        <div className="mb-4 rounded-lg border border-indigo-100 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/40 p-3 text-sm text-indigo-900 dark:text-indigo-200">
          Preview:{' '}
          <code className="text-xs">{`${baseUrl}/embed/w/${siteId}?theme=${theme}&layout=${layout}`}</code>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4 max-h-48 overflow-auto">
        <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-all">{code}</pre>
      </div>

      <Button onClick={copy} variant="outline" className="w-full sm:w-auto">
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy embed code
          </>
        )}
      </Button>
    </Card>
  );
}
