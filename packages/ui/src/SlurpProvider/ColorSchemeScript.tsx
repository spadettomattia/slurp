import { DEFAULT_STORAGE_KEY, type ColorSchemeMode } from '../lib/theme';

export interface ColorSchemeScriptProps {
  /** Same key as SlurpProvider's `storageKey`. */
  storageKey?: string;
  /** Same as the theme's `colorScheme`. */
  defaultMode?: ColorSchemeMode;
  nonce?: string;
}

/**
 * Applies the remembered colour scheme before the first paint (no flash of the wrong theme with SSR).
 * Render it in <head>, and put `suppressHydrationWarning` on <html>: the script changes its `data-theme`.
 */
export function ColorSchemeScript({
  storageKey = DEFAULT_STORAGE_KEY,
  defaultMode = 'system',
  nonce,
}: ColorSchemeScriptProps) {
  const code = `(function(){var m;try{m=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}if(m!=='light'&&m!=='dark'&&m!=='system')m=${JSON.stringify(defaultMode)};var r=document.documentElement;if(m==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',m)})()`;
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: code }} />;
}
