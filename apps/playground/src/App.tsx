import { cssVar } from '@slurp-ui/react/tokens';

// Real-world test bed of the collapse/expand flow (entry grid → list → detail).
export function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: cssVar('space-8'),
        background: cssVar('bg'),
        color: cssVar('fg'),
        font: cssVar('font-body'),
      }}
    >
      <h1
        style={{
          margin: 0,
          font: cssVar('font-display-xl'),
          letterSpacing: cssVar('font-display-xl-tracking'),
        }}
      >
        Di cosa hai bisogno?
      </h1>
      <p style={{ color: cssVar('muted') }}>Il flusso griglia → lista → dettaglio è in arrivo.</p>
    </main>
  );
}
