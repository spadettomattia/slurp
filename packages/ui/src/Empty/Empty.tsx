import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface EmptyOwnProps {
  /** What happened ("Nessun risultato"). */
  title: ReactNode;
  /** Why, or what to try. */
  description?: ReactNode;
  /** One action only ("Azzera filtri"). */
  action?: ReactNode;
  /** A decorative illustration. */
  media?: ReactNode;
}

export type EmptyProps<E extends ElementType = 'div'> = PolymorphicProps<E, EmptyOwnProps>;

/** Empty state: a message and a single way out. Announced politely when it appears (`role="status"`). */
export function Empty<E extends ElementType = 'div'>(props: EmptyProps<E>) {
  const { as, css, className, title, description, action, media, ...rest } = useThemeProps(
    'Empty',
    props as EmptyProps,
  );
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Empty', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-empty', styled.className, className)} role="status" {...root}>
        {media != null && (
          <span className="slurp-empty-media" aria-hidden="true">
            {media}
          </span>
        )}
        <p className="slurp-empty-title">{title}</p>
        {description != null && <p className="slurp-empty-description">{description}</p>}
        {action != null && <div className="slurp-empty-action">{action}</div>}
      </Root>
    </>
  );
}
