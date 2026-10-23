import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AccentScope,
  AnimationGroup,
  Cell,
  Flow,
  Text,
  useSlurpEnter,
  useSlurpNavigate,
} from '@slurp-ui/react';
import { useRef, useState } from 'react';

const HUES = ['violet', 'blue', 'pink', 'green', 'orange', 'teal'] as const;
type Hue = (typeof HUES)[number];

/**
 * Two "routes" behind a navigate function that only sets state: the hooks take any router's navigate.
 * Each route unmounts the other, as a real router does.
 */
function NavigationDemo() {
  const [route, setRoute] = useState<Hue | null>(null);
  const go = useSlurpNavigate(setRoute);
  return route ? (
    <Detail hue={route} onBack={() => go(null, { from: 'route-crumb', lead: `route-${route}` })} />
  ) : (
    <Grid
      onOpen={(h) => go(h, { from: { group: 'routes' }, lead: `route-${h}`, to: 'route-crumb' })}
    />
  );
}

function Grid({ onOpen }: { onOpen: (hue: Hue) => void }) {
  useSlurpEnter({ group: 'routes' });
  return (
    <AnimationGroup id="routes">
      <Cell css={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {HUES.map((h) => (
          <AccentScope
            key={h}
            as="button"
            type="button"
            color={`hue-${h}`}
            animationId={`route-${h}`}
            onClick={() => onOpen(h)}
            css={{
              border: 0,
              bg: 'accent',
              color: 'on-accent',
              radius: 'card',
              minHeight: 120,
              p: 5,
              font: 'title-s',
              textAlign: 'start',
              cursor: 'pointer',
            }}
          >
            {h}
          </AccentScope>
        ))}
      </Cell>
    </AnimationGroup>
  );
}

function Detail({ hue, onBack }: { hue: Hue; onBack: () => void }) {
  const content = useRef<HTMLDivElement>(null);
  // The crumb is the target; the rest of the "page" fades in while the droplets land on it.
  useSlurpEnter(undefined, { content });
  return (
    <Flow gap={5}>
      <Flow direction="row" gap={2} align="center">
        <AccentScope
          as="button"
          type="button"
          color={`hue-${hue}`}
          animationId="route-crumb"
          onClick={onBack}
          css={{
            border: 0,
            bg: 'accent',
            color: 'on-accent',
            radius: 'full',
            minHeight: 44,
            px: 5,
            font: 'label',
            cursor: 'pointer',
          }}
        >
          ← {hue}
        </AccentScope>
      </Flow>
      <Flow gap={3} ref={content}>
        <Text font="display-l">{hue}</Text>
        <Text muted>
          Questa “route” ha smontato la griglia: le gocce partono dalle misure prese prima.
        </Text>
      </Flow>
    </Flow>
  );
}

const meta = {
  title: 'Animazione/Navigazione tra route',
  component: NavigationDemo,
} satisfies Meta<typeof NavigationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
