import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AccentScope,
  AnimationGroup,
  Cell,
  Flow,
  Text,
  useSlurp,
  type MotionOptions,
} from '@slurp-ui/react';
import type { SlurpAnimation } from '@slurp-ui/react/motion';
import { useState } from 'react';

const HUES = ['violet', 'blue', 'pink', 'green', 'orange', 'teal'] as const;

type DemoProps = Pick<MotionOptions, 'duration' | 'stagger' | 'curve' | 'swell' | 'goo' | 'ghost'>;

const button = {
  border: 0,
  radius: 'full',
  minHeight: 44,
  px: 5,
  font: 'label',
  bg: 'surface-2',
  color: 'fg',
  cursor: 'pointer',
} as const;

/** n items and one target: Collapse merges the items into the target, Expand bursts them back out. */
function CollapseDemo(props: DemoProps) {
  const { collapse, expand } = useSlurp();
  const [run, setRun] = useState<SlurpAnimation | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const start = (r: SlurpAnimation, ended: boolean) => {
    setRun(r);
    void r.finished.then((result) => {
      setRun((current) => (current === r ? null : current));
      if (result === 'finished') setCollapsed(ended);
      if (result === 'reversed') setCollapsed(!ended);
    });
  };

  return (
    <Flow gap={6}>
      <Flow direction="row" gap={2} wrap>
        <Cell
          as="button"
          type="button"
          css={button}
          disabled={collapsed}
          onClick={() =>
            start(
              collapse({
                items: { group: 'demo' },
                target: 'demo-target',
                lead: 'demo-2',
                ...props,
              }),
              true,
            )
          }
        >
          Collapse
        </Cell>
        <Cell
          as="button"
          type="button"
          css={button}
          disabled={!collapsed}
          onClick={() =>
            start(
              expand({ source: 'demo-target', items: { group: 'demo' }, lead: 'demo-2', ...props }),
              false,
            )
          }
        >
          Expand
        </Cell>
        <Cell as="button" type="button" css={button} disabled={!run} onClick={() => run?.reverse()}>
          Inverti
        </Cell>
      </Flow>
      <AnimationGroup id="demo">
        <Cell css={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {HUES.map((h, i) => (
            <AccentScope
              key={h}
              color={`hue-${h}`}
              animationId={`demo-${i}`}
              css={{
                bg: 'accent',
                color: 'on-accent',
                radius: 'card',
                minHeight: 120,
                p: 5,
                font: 'title-s',
              }}
            >
              {h}
            </AccentScope>
          ))}
        </Cell>
      </AnimationGroup>
      <Flow direction="row" justify="center">
        <AccentScope
          color="hue-pink"
          animationId="demo-target"
          css={{
            bg: 'accent',
            color: 'on-accent',
            radius: 'full',
            px: 5,
            py: 3,
            font: 'label',
          }}
        >
          Destinazione
        </AccentScope>
      </Flow>
      <Text font="caption" muted>
        La sezione «pink» è la lead: nel collapse si fonde per ultima, nell'expand esce per prima.
      </Text>
    </Flow>
  );
}

const meta = {
  title: 'Animazione/Collapse ed expand',
  component: CollapseDemo,
  args: {
    duration: 650,
    stagger: 0.35,
    curve: 0.16,
    swell: 1.08,
    goo: 'auto',
    ghost: 'shape',
  },
  argTypes: {
    duration: { control: { type: 'range', min: 150, max: 3000, step: 50 } },
    stagger: { control: { type: 'range', min: 0, max: 0.8, step: 0.05 } },
    curve: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 } },
    swell: { control: { type: 'range', min: 1, max: 1.3, step: 0.01 } },
    goo: { control: 'inline-radio', options: ['auto', true, false] },
    ghost: { control: 'inline-radio', options: ['shape', 'snapshot'] },
  },
} satisfies Meta<typeof CollapseDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Snapshot: Story = {
  name: 'Copia del contenuto',
  args: { ghost: 'snapshot', duration: 1200 },
};
