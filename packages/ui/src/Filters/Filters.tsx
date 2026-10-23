import { ResetIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface FiltersLabels {
  title: string;
  reset: string;
}

export const FILTERS_LABELS: FiltersLabels = { title: 'Filtri', reset: 'Azzera filtri' };

export interface FiltersOwnProps {
  /** Clears every filter. Off (muted outline) when nothing is active. */
  onReset?: () => void;
  /** How many filters are active: the reset is disabled at 0. */
  active?: number;
  labels?: Partial<FiltersLabels>;
  /** Filters.Group elements. */
  children?: ReactNode;
}

export type FiltersProps<E extends ElementType = 'div'> = PolymorphicProps<E, FiltersOwnProps>;

/**
 * Filter panel content (in the Dock's panel or a Sheet): a title, "Azzera filtri" at the top right, then groups of
 * chips.
 */
function FiltersRoot<E extends ElementType = 'div'>(props: FiltersProps<E>) {
  const {
    as,
    css,
    className,
    onReset,
    active = 0,
    labels: labelsProp,
    children,
    ...rest
  } = useThemeProps('Filters', props as FiltersProps);
  const labels = { ...FILTERS_LABELS, ...labelsProp };
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Filters', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-filters', styled.className, className)} {...root}>
        <div className="slurp-filters-head">
          <h2 className="slurp-filters-title">{labels.title}</h2>
          {onReset && (
            <button
              type="button"
              className="slurp-filters-reset"
              disabled={active === 0}
              onClick={onReset}
            >
              <ResetIcon size={16} />
              {labels.reset}
            </button>
          )}
        </div>
        {children}
      </Root>
    </>
  );
}

export interface FiltersGroupProps {
  /** Name of the group ("Condizione"). */
  label: ReactNode;
  /** Chips. */
  children?: ReactNode;
  className?: string;
}

/** A group of filter chips with its name (a fieldset and legend). */
function FiltersGroup({ label, children, className }: FiltersGroupProps) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className={cx('slurp-filters-group', className)}>
      <span id={id} className="slurp-filters-legend">
        {label}
      </span>
      <div className="slurp-filters-chips">{children}</div>
    </div>
  );
}

export const Filters = Object.assign(FiltersRoot, { Group: FiltersGroup });
export { FiltersGroup };
