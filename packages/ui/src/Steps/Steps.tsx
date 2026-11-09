import { CheckIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { Fragment, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface StepItem<V extends string = string> {
  value: V;
  label: ReactNode;
  /** A short line under the label: the choice made in that step ("Grigio siderale"). */
  description?: ReactNode;
  /** Never reachable from the steps, even when done. */
  disabled?: boolean;
}

export interface StepsLabels {
  /** Name of the navigation landmark. */
  label: string;
  /** Read after the label of a completed step. */
  done: string;
}

export const STEPS_LABELS: StepsLabels = { label: 'Passaggi', done: 'completato' };

export interface StepsOwnProps<V extends string = string> extends PartsProps<'list' | 'step'> {
  steps: StepItem<V>[];
  /** The current step. */
  value?: V;
  /** Default the first step. */
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /**
   * Steps you can go to: `done` (default) the completed ones, to change an earlier choice; `all` any step; `none` no
   * step (the flow moves only with its own buttons).
   */
  navigable?: 'done' | 'all' | 'none';
  /** Default `horizontal`; on phones the labels of the other steps hide. */
  orientation?: 'horizontal' | 'vertical';
  labels?: Partial<StepsLabels>;
}

export type StepsProps<V extends string = string, E extends ElementType = 'nav'> = PolymorphicProps<
  E,
  StepsOwnProps<V>
>;

/**
 * The steps of a flow of choices: done steps carry a check and can be reopened, the current one is ringed and marked
 * `aria-current="step"`, the next ones wait with their number. State is shape + word, never colour alone.
 */
export function Steps<V extends string = string, E extends ElementType = 'nav'>(
  props: StepsProps<V, E>,
) {
  const {
    as,
    css,
    className,
    steps,
    value: valueProp,
    defaultValue,
    onValueChange,
    navigable = 'done',
    orientation = 'horizontal',
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Steps', props as unknown as StepsProps);
  const labels = { ...STEPS_LABELS, ...labelsProp };
  const [value, setValue] = useControlled<string | undefined>({
    value: valueProp,
    defaultValue: defaultValue ?? steps[0]?.value,
    onChange: onValueChange as ((v: string | undefined) => void) | undefined,
  });
  const current = Math.max(
    0,
    steps.findIndex((s) => s.value === value),
  );
  const Root = (as ?? 'nav') as ElementType;
  const styled = useCss('Steps', 'root', css);
  const { part, style } = useParts('Steps', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-steps', styled.className, className)}
        aria-label={labels.label}
        data-orientation={orientation}
        {...root}
      >
        {part('list', 'ol', {
          className: 'slurp-steps-list',
          children: steps.map((s, i) => {
            const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
            const reachable =
              i !== current &&
              !s.disabled &&
              (navigable === 'all' || (navigable === 'done' && state === 'done'));
            const body = (
              <>
                <span className="slurp-steps-marker" aria-hidden="true">
                  {state === 'done' ? <CheckIcon size={18} /> : i + 1}
                </span>
                <span className="slurp-steps-text">
                  <span className="slurp-steps-label">
                    {s.label}
                    {state === 'done' && (
                      <span className="slurp-visually-hidden">, {labels.done}</span>
                    )}
                  </span>
                  {s.description != null && (
                    <span className="slurp-steps-description">{s.description}</span>
                  )}
                </span>
              </>
            );
            return (
              <Fragment key={s.value}>
                {part('step', 'li', {
                  className: 'slurp-steps-step',
                  'data-state': state,
                  'aria-current': state === 'current' ? 'step' : undefined,
                  children: reachable ? (
                    <button
                      type="button"
                      className="slurp-steps-control"
                      onClick={() => setValue(s.value)}
                    >
                      {body}
                    </button>
                  ) : (
                    <span className="slurp-steps-control">{body}</span>
                  ),
                })}
              </Fragment>
            );
          }),
        })}
      </Root>
    </>
  );
}
