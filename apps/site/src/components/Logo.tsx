import { useId } from 'react';

/**
 * The mark of Slurp UI: two cells fusing through a liquid bridge — the collapse / expand idea, drawn with the same
 * goo the transition uses (blur + alpha threshold). It takes the accent (currentColor).
 */
export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  const id = `goo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} fill="currentColor">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="17.6" cy="17.4" r="3.2" />
        <circle cx="22.6" cy="22" r="5.8" />
      </g>
    </svg>
  );
}
