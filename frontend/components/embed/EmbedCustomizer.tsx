'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WallOfLove from '@/components/wall/WallOfLove';
import { WIDGET_THEME_LIST, type WidgetThemePreset } from '@/lib/widgetThemes';
import {
  DEFAULT_CUSTOMIZE,
  mergeCustomize,
  type WidgetCustomizeConfig,
  type WallLayout,
} from '@/lib/widget/customizer';
import { DEMO_TESTIMONIALS } from '@/lib/demo/mockData';
import { useToast } from '@/components/ui/Toast';

interface EmbedCustomizerProps {
  siteId: string;
  initial?: Partial<WidgetCustomizeConfig> | null;
  onSave: (config: WidgetCustomizeConfig) => Promise<void>;
}

const LAYOUTS: WallLayout[] = ['grid', 'carousel', 'marquee', 'list', 'bento', 'masonry', 'floating', 'columns'];

export default function EmbedCustomizer({ siteId, initial, onSave }: EmbedCustomizerProps) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<WidgetCustomizeConfig>(() =>
    mergeCustomize({ ...DEFAULT_CUSTOMIZE, ...initial })
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setConfig(mergeCustomize({ ...DEFAULT_CUSTOMIZE, ...initial }));
  }, [initial]);

  const preview = useMemo(
    () => (
      <WallOfLove
        testimonials={DEMO_TESTIMONIALS.slice(0, 6)}
        themePreset={config.themePreset}
        layout={config.layout}
        compact
        customize={config}
      />
    ),
    [config]
  );

  const update = <K extends keyof WidgetCustomizeConfig>(key: K, value: WidgetCustomizeConfig[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
      showToast('Widget customization saved', 'success');
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Visual embed customizer</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Tune theme, layout, and motion — preview updates live.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {WIDGET_THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update('themePreset', t.id as WidgetThemePreset)}
                  className={`px-2 py-2 rounded-lg text-xs font-medium border capitalize ${
                    config.themePreset === t.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {t.id}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Layout</label>
            <select
              value={config.layout}
              onChange={(e) => update('layout', e.target.value as WallLayout)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Spacing: {config.spacing}px
            </label>
            <input
              type="range"
              min={8}
              max={32}
              value={config.spacing}
              onChange={(e) => update('spacing', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Border radius</label>
              <input
                type="range"
                min={0}
                max={24}
                value={config.borderRadius}
                onChange={(e) => update('borderRadius', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shadow</label>
              <select
                value={config.shadow}
                onChange={(e) => update('shadow', e.target.value as WidgetCustomizeConfig['shadow'])}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-1.5 text-sm"
              >
                {(['none', 'sm', 'md', 'lg'] as const).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animation</label>
            <select
              value={config.animationStyle}
              onChange={(e) => update('animationStyle', e.target.value as WidgetCustomizeConfig['animationStyle'])}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="none">None</option>
              <option value="subtle">Subtle</option>
              <option value="spring">Spring</option>
              <option value="glow">Glow</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={config.hideBranding}
              onChange={(e) => update('hideBranding', e.target.checked)}
              className="rounded border-gray-300 dark:border-slate-600"
            />
            Hide &ldquo;Powered by TestiFlow&rdquo;
          </label>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Save customization'}
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden min-h-[360px] bg-gray-50">
          {preview}
        </div>
      </div>
    </Card>
  );
}
