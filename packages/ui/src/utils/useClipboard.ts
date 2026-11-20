import { useCallback, useEffect, useState } from 'react';

export interface UseClipboardOptions {
  /** ms the `copied` state lasts. Default 2000. */
  timeout?: number;
}

/**
 * Copies text to the clipboard. `copied` is true for `timeout` ms after a copy that succeeded, so the control can say
 * so; `copy` resolves to false when the browser refuses (no permission, insecure page).
 */
export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), timeout);
    return () => clearTimeout(t);
  }, [copied, timeout]);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return true;
    } catch {
      return false;
    }
  }, []);
  return { copy, copied };
}
