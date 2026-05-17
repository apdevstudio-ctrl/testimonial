import Link from 'next/link';
import { notFound } from 'next/navigation';
import WallOfLove from '@/components/wall/WallOfLove';
import { DEMO_PRESETS, DEMO_TESTIMONIALS } from '@/lib/demo/mockData';
import type { WidgetThemePreset } from '@/lib/widgetThemes';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';
import type { Metadata } from 'next';

interface PageProps {
  params: { preset: string };
}

export function generateStaticParams() {
  return DEMO_PRESETS.map((p) => ({ preset: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const preset = DEMO_PRESETS.find((p) => p.id === params.preset);
  if (!preset) return { title: 'Example not found' };
  return {
    title: `${preset.name} — TestiFlow demo`,
    description: preset.description,
  };
}

export default function ExamplePresetPage({ params }: PageProps) {
  const preset = DEMO_PRESETS.find((p) => p.id === params.preset);
  if (!preset) notFound();

  const embedSnippet = `<div data-testiflow-wall="YOUR_SITE_ID" data-layout="${preset.layout}" data-theme="${preset.theme}"></div>
<script src="https://testiflow.site/embed.js" async></script>`;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/examples" className="text-sm text-indigo-600 font-medium">
            ← All examples
          </Link>
          <h1 className="text-sm font-semibold text-gray-900 truncate">{preset.name}</h1>
          <Link href="/signup" className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 shrink-0">
            Use this layout
          </Link>
        </div>
      </div>

      <WallOfLove
        testimonials={DEMO_TESTIMONIALS}
        themePreset={preset.theme as WidgetThemePreset}
        layout={preset.layout as WidgetCustomizeConfig['layout']}
        title={preset.title}
        subtitle={preset.subtitle}
        customize={{ animationStyle: 'spring' }}
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Embed code</h2>
        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">{embedSnippet}</pre>
      </div>
    </div>
  );
}
