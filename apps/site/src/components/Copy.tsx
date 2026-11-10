import { CheckIcon } from '@slurp-ui/icons';
import { Bubble } from '@slurp-ui/react';
import { useEffect, useState } from 'react';

import { useLang } from '~/lib/lang';

/** Copies a snippet; says so (icon and name) for two seconds. */
export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { copy } = useLang();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2000);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <Bubble
      size="sm"
      className="site-copy"
      label={done ? copy.copied : (label ?? copy.copyCode)}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => setDone(true));
      }}
    >
      {done ? <CheckIcon size={18} /> : <CopyIcon />}
    </Bubble>
  );
}

// Two rounded sheets, drawn like the design system's stroke icons (2px, round caps).
function CopyIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="12" height="12" rx="3" />
      <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
    </svg>
  );
}
