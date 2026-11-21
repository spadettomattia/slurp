import { Portal } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ overflow: 'hidden', height: 40 }}>
      Un contenitore che taglia.
      <Portal>
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 96,
            padding: 12,
            borderRadius: 16,
            background: 'var(--slurp-surface-dock)',
            border: '1px solid var(--slurp-line)',
          }}
        >
          Fuori dal contenitore
        </div>
      </Portal>
    </div>
  );
}
