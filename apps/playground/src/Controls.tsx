import { Cell, Flow, Surface, Text } from '@slurp-ui/react';
import type { SlurpAnimation, SlurpResult } from '@slurp-ui/react/motion';
import type { ReactNode } from 'react';

import type { MotionSettings as Settings } from './App';

export interface Stats {
  result: SlurpResult;
  fps: number;
  slow: number;
}

const RESULT: Record<SlurpResult, string> = {
  finished: 'completata',
  reversed: 'invertita',
  cancelled: 'annullata',
};

const field = { display: 'grid', gap: 1, font: 'caption', color: 'muted' } as const;
const control = {
  font: 'body-s',
  color: 'fg',
  bg: 'surface-2',
  border: 0,
  radius: 'sm',
  minHeight: 44,
  px: 3,
} as const;
const action = { ...control, radius: 'full', px: 5, cursor: 'pointer' } as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Cell as="label" css={field}>
      {label}
      {children}
    </Cell>
  );
}

export function Controls({
  settings,
  onSettings,
  run,
  stats,
}: {
  settings: Settings;
  onSettings: (s: Settings) => void;
  run: SlurpAnimation | null;
  stats: Stats | null;
}) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onSettings({ ...settings, [key]: value });
  return (
    <Surface as="section" aria-label="Parametri dell'animazione" css={{ p: 5 }}>
      <Flow gap={4}>
        <Cell
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 4,
            alignItems: 'end',
          }}
        >
          <Field label={`Durata · ${settings.duration} ms`}>
            <input
              type="range"
              min={300}
              max={2000}
              step={50}
              value={settings.duration}
              onChange={(e) => set('duration', Number(e.target.value))}
            />
          </Field>
          <Field label={`Sfalsamento · ${settings.stagger.toFixed(2)}`}>
            <input
              type="range"
              min={0}
              max={0.8}
              step={0.05}
              value={settings.stagger}
              onChange={(e) => set('stagger', Number(e.target.value))}
            />
          </Field>
          <Field label="Ponti liquidi (goo)">
            <Cell
              as="select"
              css={control}
              value={String(settings.goo)}
              onChange={(e: { target: { value: string } }) =>
                set('goo', e.target.value === 'auto' ? 'auto' : e.target.value === 'true')
              }
            >
              <option value="auto">Automatici</option>
              <option value="true">Sempre</option>
              <option value="false">Mai</option>
            </Cell>
          </Field>
          <Field label="Goccia">
            <Cell
              as="select"
              css={control}
              value={settings.ghost}
              onChange={(e: { target: { value: string } }) =>
                set('ghost', e.target.value as Settings['ghost'])
              }
            >
              <option value="shape">Forma</option>
              <option value="snapshot">Copia del contenuto</option>
            </Cell>
          </Field>
          <Field label="Movimento ridotto">
            <Cell
              as="select"
              css={control}
              value={settings.reducedMotion}
              onChange={(e: { target: { value: string } }) =>
                set('reducedMotion', e.target.value as Settings['reducedMotion'])
              }
            >
              <option value="user">Come il sistema</option>
              <option value="always">Sempre</option>
              <option value="never">Mai</option>
            </Cell>
          </Field>
        </Cell>
        <Flow direction="row" gap={2} wrap align="center">
          <Cell
            as="button"
            type="button"
            css={action}
            disabled={!run}
            onClick={() => run?.reverse()}
          >
            Inverti
          </Cell>
          <Cell
            as="button"
            type="button"
            css={action}
            disabled={!run}
            onClick={() => run?.cancel()}
          >
            Annulla
          </Cell>
          <Cell
            as="button"
            type="button"
            css={action}
            disabled={!run}
            onClick={() => run?.finish()}
          >
            Termina
          </Cell>
          <Text font="caption" muted role="status" data-testid="stats" css={{ ml: 2 }}>
            {stats
              ? `Ultima transizione ${RESULT[stats.result]}: ${stats.fps} fps, ${stats.slow} frame oltre 20 ms`
              : run
                ? 'In corso…'
                : 'Tocca una sezione per avviare il collapse, poi il crumb nel Dock per tornare indietro.'}
          </Text>
        </Flow>
      </Flow>
    </Surface>
  );
}
