import { useLocation } from 'react-router';

import { LANGS, type Lang } from '../../site.config';
import { COPY, type Copy } from './i18n';

/** Language of a pathname (`/it/...`, `/en/...`); Italian, the source language, otherwise. */
export function langOf(pathname: string): Lang {
  const first = pathname.split('/').find(Boolean);
  return (LANGS as readonly string[]).includes(first ?? '') ? (first as Lang) : 'it';
}

/** The page's slug without the language: `components/button`. */
export function slugOf(pathname: string): string {
  return pathname.split('/').filter(Boolean).slice(1).join('/');
}

export function useLang(): { lang: Lang; copy: Copy; slug: string } {
  const { pathname } = useLocation();
  const lang = langOf(pathname);
  return { lang, copy: COPY[lang], slug: slugOf(pathname) };
}

/** Link to a page in a language. */
export const href = (lang: Lang, slug: string) => (slug ? `/${lang}/${slug}` : `/${lang}`);
