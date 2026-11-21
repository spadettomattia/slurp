import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface TimelineItem {
  /** What happened. */
  title: ReactNode;
  /** When, as text ("12 marzo 2026", "Ieri"). With `dateTime` it becomes a `<time>`. */
  time?: string;
  /** Machine-readable date of `time` (ISO 8601). */
  dateTime?: string;
  description?: ReactNode;
  /** A decorative icon in the marker, in place of the dot. */
  icon?: ReactNode;
}

export interface TimelineOwnProps {
  items: TimelineItem[];
  /** The newest event is the first of `items` (an activity log) and gets the accent marker. Default false. */
  latestFirst?: boolean;
}

export type TimelineProps<E extends ElementType = 'ol'> = PolymorphicProps<E, TimelineOwnProps>;

/** A vertical list of events in order, joined by a line: a history, a roadmap, the steps of an order. */
export function Timeline<E extends ElementType = 'ol'>(props: TimelineProps<E>) {
  const {
    as,
    css,
    className,
    items,
    latestFirst = false,
    ...rest
  } = useThemeProps('Timeline', props as TimelineProps);
  const Root = (as ?? 'ol') as ElementType;
  const styled = useCss('Timeline', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-timeline', styled.className, className)} {...root}>
        {items.map((item, i) => (
          <li
            key={i}
            className="slurp-timeline-item"
            data-latest={latestFirst && i === 0 ? '' : undefined}
          >
            <span className="slurp-timeline-marker" aria-hidden="true">
              {item.icon}
            </span>
            <div className="slurp-timeline-content">
              <div className="slurp-timeline-title">{item.title}</div>
              {item.time != null &&
                (item.dateTime ? (
                  <time className="slurp-timeline-time" dateTime={item.dateTime}>
                    {item.time}
                  </time>
                ) : (
                  <span className="slurp-timeline-time">{item.time}</span>
                ))}
              {item.description != null && (
                <div className="slurp-timeline-description">{item.description}</div>
              )}
            </div>
          </li>
        ))}
      </Root>
    </>
  );
}
