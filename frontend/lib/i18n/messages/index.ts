import type { Locale } from '../config';
import type { Messages } from './en';
import en from './en';
import es from './es';
import fr from './fr';
import de from './de';
import hi from './hi';
import pt from './pt';

const dictionaries: Record<Locale, Messages> = { en, es, fr, de, hi, pt };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? en;
}

export type { Messages };
