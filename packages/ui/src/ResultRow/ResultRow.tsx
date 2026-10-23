import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface ResultRowOwnProps {
  title: ReactNode;
  meta?: ReactNode;
  value?: ReactNode;
  /** Small media (44px), decorative. */
  media?: ReactNode;
}

export type ResultRowProps<E extends ElementType = 'button'> = PolymorphicProps<
  E,
  ResultRowOwnProps
>;

/**
 * A search result: media, title, meta and a value; the whole row is one control. Rows carry `data-result`, so the
 * results list moves with the arrow keys (`moveFocus(e, root, '[data-result]')`).
 */
export function ResultRow<E extends ElementType = 'button'>(props: ResultRowProps<E>) {
  const { as, css, className, title, meta, value, media, ...rest } = useThemeProps(
    'ResultRow',
    props as ResultRowProps,
  );
  const Root = (as ?? 'button') as ElementType;
  const styled = useCss('ResultRow', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-result-row', styled.className, className)}
        data-result=""
        {...(Root === 'button' ? { type: 'button' } : null)}
        {...root}
      >
        {media != null && (
          <span className="slurp-result-row-media" aria-hidden="true">
            {media}
          </span>
        )}
        <span className="slurp-result-row-text">
          <span className="slurp-result-row-title">{title}</span>
          {meta != null && <span className="slurp-result-row-meta">{meta}</span>}
        </span>
        {value != null && <span className="slurp-result-row-value">{value}</span>}
      </Root>
    </>
  );
}
