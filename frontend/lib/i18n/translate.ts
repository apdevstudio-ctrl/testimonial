import type { Messages } from './messages/en';

/** Dot-path lookup: t(messages, 'nav.signIn') */
export function t(messages: Messages, key: string): string {
  const parts = key.split('.');
  let cur: unknown = messages;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return key;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === 'string' ? cur : key;
}
