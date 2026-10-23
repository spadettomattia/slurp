import { ChevronDownIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface FoldOwnProps extends PartsProps<'heading' | 'trigger' | 'region'> {
  /** The always-visible row (the button's text). */
  summary: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Level of the heading that wraps the button. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
}

export type FoldProps<E extends ElementType = 'div'> = PolymorphicProps<E, FoldOwnProps>;

/** Disclosure (accordion item): opens by growing in height; closed content is out of the tab order. */
export function Fold<E extends ElementType = 'div'>(props: FoldProps<E>) {
  const {
    as,
    css,
    className,
    summary,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    headingLevel = 3,
    children,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Fold', props as FoldProps);
  const [open, setOpen] = useControlled({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Fold', 'root', css);
  const { part, style } = useParts('Fold', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-fold', styled.className, className)}
        data-state={open ? 'open' : 'closed'}
        {...root}
      >
        {part('heading', `h${headingLevel}`, {
          className: 'slurp-fold-heading',
          children: part('trigger', 'button', {
            type: 'button',
            id: `${id}-trigger`,
            className: 'slurp-fold-trigger',
            'aria-expanded': open,
            'aria-controls': `${id}-region`,
            onClick: () => setOpen(!open),
            children: (
              <>
                <span className="slurp-fold-summary">{summary}</span>
                <ChevronDownIcon className="slurp-fold-chevron" />
              </>
            ),
          }),
        })}
        {part('region', 'div', {
          id: `${id}-region`,
          role: 'region',
          'aria-labelledby': `${id}-trigger`,
          className: 'slurp-fold-region',
          inert: !open,
          children: <div className="slurp-fold-content">{children}</div>,
        })}
      </Root>
    </>
  );
}
