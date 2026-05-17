import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DOC_SECTIONS } from '@/lib/docs/sections';
import DocMarkdown from '@/components/docs/DocMarkdown';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return DOC_SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = DOC_SECTIONS.find((s) => s.slug === params.slug);
  if (!doc) return { title: 'Docs' };
  return {
    title: `${doc.title} — TestiFlow Docs`,
    description: doc.description,
    alternates: { canonical: `/docs/${doc.slug}` },
  };
}

export default function DocPage({ params }: Props) {
  const doc = DOC_SECTIONS.find((s) => s.slug === params.slug);
  if (!doc) notFound();

  const index = DOC_SECTIONS.findIndex((s) => s.slug === params.slug);
  const prev = index > 0 ? DOC_SECTIONS[index - 1] : null;
  const next = index < DOC_SECTIONS.length - 1 ? DOC_SECTIONS[index + 1] : null;

  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-10 py-10 lg:py-14">
      <p className="text-sm font-medium text-indigo-600 mb-2">Documentation</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">{doc.title}</h1>
      <p className="text-lg text-zinc-600 mb-10 pb-10 border-b border-zinc-200">{doc.description}</p>
      <DocMarkdown content={doc.content} />

      <nav className="mt-16 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row justify-between gap-4">
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className="group text-sm">
            <span className="text-zinc-500 block mb-1">Previous</span>
            <span className="font-medium text-indigo-600 group-hover:underline">← {prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/docs/${next.slug}`} className="group text-sm text-right sm:ml-auto">
            <span className="text-zinc-500 block mb-1">Next</span>
            <span className="font-medium text-indigo-600 group-hover:underline">{next.title} →</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
