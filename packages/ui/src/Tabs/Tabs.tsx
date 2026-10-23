import { spring } from '@slurp-ui/motion';
import { cx } from '@slurp-ui/utils';
import {
  Fragment,
  useId,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';
import { useRovingFocus } from '../utils/useRovingFocus';

export interface TabItem<V extends string = string> {
  value: V;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsOwnProps<V extends string = string> extends PartsProps<
  'list' | 'tab' | 'indicator' | 'panel'
> {
  /** Name of the tab list ("Dettagli prodotto"). */
  label: string;
  items: TabItem<V>[];
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
}

export type TabsProps<V extends string = string, E extends ElementType = 'div'> = PolymorphicProps<
  E,
  TabsOwnProps<V>
>;

/** The pill indicator travels on a spring (stiffness 200, damping 22): a CSS linear() easing, no JS per frame. */
const INDICATOR = spring({ stiffness: 200, damping: 22 });

/** Tabs: a pill indicator under the selected tab; arrow keys move and select, Home / End go to the ends. */
export function Tabs<V extends string = string, E extends ElementType = 'div'>(
  props: TabsProps<V, E>,
) {
  const {
    as,
    css,
    className,
    label,
    items,
    value: valueProp,
    defaultValue,
    onValueChange,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Tabs', props as unknown as TabsProps);
  const first = items.find((i) => !i.disabled)?.value;
  const [value, setValue] = useControlled<string | undefined>({
    value: valueProp,
    defaultValue: defaultValue ?? first,
    onChange: onValueChange as ((v: string | undefined) => void) | undefined,
  });
  const list = useRef<HTMLDivElement>(null);
  const { onKeyDown } = useRovingFocus(list, { selector: '[role="tab"]', select: true });
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Tabs', 'root', css);
  const { part, style } = useParts('Tabs', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const active = items.find((i) => i.value === value);

  // The indicator follows the selected tab: its box is written as CSS variables on the list (no re-render).
  useLayoutEffect(() => {
    const el = list.current;
    const tab = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !tab) return;
    const place = () => {
      el.style.setProperty('--slurp-tabs-x', `${tab.offsetLeft}px`);
      el.style.setProperty('--slurp-tabs-w', `${tab.offsetWidth}px`);
    };
    place();
    // The first placement does not travel: the spring starts from the next frame on.
    const ready = requestAnimationFrame(() => (el.dataset.ready = ''));
    if (typeof ResizeObserver === 'undefined') return () => cancelAnimationFrame(ready);
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(ready);
      ro.disconnect();
    };
  }, [value]);

  return (
    <>
      {styled.style}
      {style}
      <Root className={cx('slurp-tabs', styled.className, className)} {...root}>
        {part('list', 'div', {
          ref: list,
          role: 'tablist',
          'aria-label': label,
          className: 'slurp-tabs-list',
          onKeyDown,
          style: {
            '--slurp-tabs-easing': INDICATOR.easing,
            '--slurp-tabs-duration': `${INDICATOR.duration}ms`,
          } as CSSProperties,
          children: (
            <>
              {part('indicator', 'span', {
                className: 'slurp-tabs-indicator',
                'aria-hidden': true,
              })}
              {items.map((item) => {
                const on = item.value === value;
                return (
                  <Fragment key={item.value}>
                    {part('tab', 'button', {
                      type: 'button',
                      role: 'tab',
                      id: `${id}-tab-${item.value}`,
                      'aria-selected': on,
                      'aria-controls': `${id}-panel-${item.value}`,
                      tabIndex: on ? 0 : -1,
                      disabled: item.disabled,
                      className: 'slurp-tabs-tab',
                      onClick: () => setValue(item.value),
                      children: item.label,
                    })}
                  </Fragment>
                );
              })}
            </>
          ),
        })}
        {active &&
          active.content !== undefined &&
          part('panel', 'div', {
            role: 'tabpanel',
            id: `${id}-panel-${active.value}`,
            'aria-labelledby': `${id}-tab-${active.value}`,
            tabIndex: 0,
            className: 'slurp-tabs-panel',
            children: active.content,
          })}
      </Root>
    </>
  );
}
