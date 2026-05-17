/** AI processing — uses OpenAI when OPENAI_API_KEY is set; otherwise heuristic fallback */

export interface AiEnrichment {
  summary?: string;
  headline?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
}

export async function enrichTestimonial(text: string): Promise<AiEnrichment> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key || !text?.trim()) {
    return heuristicEnrich(text);
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Return JSON only: { "summary": string, "headline": string, "sentiment": "positive"|"neutral"|"negative", "tags": string[] }. Tags from: support, roi, growth, reliability, ease-of-use, pricing.',
          },
          { role: 'user', content: text.slice(0, 2000) },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!res.ok) return heuristicEnrich(text);
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary,
      headline: parsed.headline,
      sentiment: parsed.sentiment,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch {
    return heuristicEnrich(text);
  }
}

function heuristicEnrich(text: string): AiEnrichment {
  const lower = (text || '').toLowerCase();
  let sentiment: AiEnrichment['sentiment'] = 'neutral';
  if (/love|great|amazing|excellent|recommend/.test(lower)) sentiment = 'positive';
  if (/bad|terrible|hate|awful|slow/.test(lower)) sentiment = 'negative';

  const tags: string[] = [];
  if (/support|help|team/.test(lower)) tags.push('support');
  if (/roi|revenue|sales|money/.test(lower)) tags.push('roi');
  if (/grow|scale|users/.test(lower)) tags.push('growth');
  if (/reliable|stable|uptime/.test(lower)) tags.push('reliability');

  const headline = text?.split(/[.!?]/)[0]?.slice(0, 80) || 'Customer testimonial';
  return {
    summary: text?.slice(0, 160),
    headline,
    sentiment,
    tags,
  };
}
