'use client';

import { useMemo } from 'react';

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <pre className="my-4 rounded-xl bg-zinc-900 text-zinc-100 p-4 overflow-x-auto text-sm leading-relaxed">
      {lang && (
        <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">{lang}</span>
      )}
      <code>{code.trim()}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-zinc-100 text-indigo-700 text-[0.9em] font-mono">
      {children}
    </code>
  );
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <InlineCode key={i}>{part.slice(1, -1)}</InlineCode>;
    }
    return part;
  });
}

export default function DocMarkdown({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const lines = content.trim().split('\n');
    const result: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || undefined;
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        result.push(<CodeBlock key={key++} code={codeLines.join('\n')} lang={lang} />);
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        result.push(
          <h2 key={key++} className="text-xl font-bold text-zinc-900 mt-10 mb-4 first:mt-0">
            {line.slice(3)}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        result.push(
          <h3 key={key++} className="text-lg font-semibold text-zinc-900 mt-8 mb-3">
            {line.slice(4)}
          </h3>
        );
        i++;
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s/, ''));
          i++;
        }
        result.push(
          <ol key={key++} className="my-4 space-y-2 list-decimal list-inside text-zinc-700 leading-relaxed">
            {items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </ol>
        );
        continue;
      }

      if (line.startsWith('- ')) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].slice(2));
          i++;
        }
        result.push(
          <ul key={key++} className="my-4 space-y-2 list-disc list-inside text-zinc-700 leading-relaxed">
            {items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      if (line.trim() === '') {
        i++;
        continue;
      }

      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('- ') && !lines[i].startsWith('```') && !/^\d+\.\s/.test(lines[i])) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length) {
        result.push(
          <p key={key++} className="my-4 text-zinc-700 leading-relaxed">
            {renderInline(paraLines.join(' '))}
          </p>
        );
      } else {
        // Unrecognized line (e.g. `# title`) — skip to avoid infinite loop during SSG
        i++;
      }
    }

    return result;
  }, [content]);

  return <div className="doc-content">{blocks}</div>;
}
