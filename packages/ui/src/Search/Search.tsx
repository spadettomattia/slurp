import { CloseIcon, SearchIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  useId,
  type ChangeEvent,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import { Bubble } from '../Bubble/Bubble';
import { splitInputProps, type InputAttributes } from '../Field/Field';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface SearchLabels {
  /** Name of the field (read by screen readers; hidden). */
  label: string;
  /** Says where it looks: "Cerca in Smartphone…". */
  placeholder: string;
  /** Name of the clear button. */
  clear: string;
  /** Result count, announced politely while typing. */
  results: (count: number) => string;
}

export const SEARCH_LABELS: SearchLabels = {
  label: 'Cerca',
  placeholder: 'Cerca…',
  clear: 'Cancella la ricerca',
  results: (n) => (n === 0 ? 'Nessun risultato' : n === 1 ? '1 risultato' : `${n} risultati`),
};

export interface SearchOwnProps
  extends Omit<InputAttributes, 'type'>, PartsProps<'icon' | 'control' | 'clear' | 'status'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enter. */
  onSearch?: (value: string) => void;
  /** Number of results: shown at the end of the field and announced (polite live region). */
  count?: number;
  labels?: Partial<SearchLabels>;
}

export type SearchProps<E extends ElementType = 'div'> = PolymorphicProps<E, SearchOwnProps>;

/** Search field: icon, contextual placeholder, result count, clear button. */
export function Search<E extends ElementType = 'div'>(props: SearchProps<E>) {
  const {
    as,
    css,
    className,
    value: valueProp,
    defaultValue = '',
    onValueChange,
    onSearch,
    count,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...others
  } = useThemeProps('Search', props as SearchProps);
  const labels = { ...SEARCH_LABELS, ...labelsProp };
  const { input, root: rest } = splitInputProps(others);
  const [value, setValue] = useControlled({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const statusId = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Search', 'root', css);
  const { part, style } = useParts('Search', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const typed = value.trim() !== '';
  const userKeyDown = input.onKeyDown as ((e: KeyboardEvent<HTMLInputElement>) => void) | undefined;
  return (
    <>
      {styled.style}
      {style}
      <Root
        role="search"
        className={cx('slurp-search', styled.className, className)}
        data-typed={typed ? '' : undefined}
        {...root}
      >
        {part('icon', 'span', {
          className: 'slurp-search-icon',
          'aria-hidden': true,
          children: <SearchIcon size={18} />,
        })}
        {part('control', 'input', {
          ...input,
          type: 'search',
          className: 'slurp-search-control',
          'aria-label': labels.label,
          'aria-describedby': count != null && typed ? statusId : undefined,
          placeholder: input.placeholder ?? labels.placeholder,
          enterKeyHint: input.enterKeyHint ?? 'search',
          autoComplete: input.autoComplete ?? 'off',
          value,
          onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
          onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
            userKeyDown?.(e);
            if (e.key === 'Enter' && !e.defaultPrevented) onSearch?.(value);
          },
        })}
        {part('status', 'span', {
          id: statusId,
          className: 'slurp-search-count',
          role: 'status',
          children: count != null && typed ? labels.results(count) : '',
        })}
        {typed &&
          part('clear', Bubble, {
            className: 'slurp-search-clear',
            label: labels.clear,
            size: 'sm',
            onClick: (e: MouseEvent<HTMLElement>) => {
              setValue('');
              e.currentTarget.parentElement?.querySelector('input')?.focus();
            },
            children: <CloseIcon size={18} />,
          })}
      </Root>
    </>
  );
}
