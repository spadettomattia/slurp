import { CheckIcon, CloseIcon, ErrorIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { splitInputProps, type InputAttributes } from '../Field/Field';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import { matchesAll } from '../lib/layout';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { Mark } from '../Mark/Mark';
import type { SuggestOption } from '../Suggest/Suggest';
import { useControlled } from '../utils/useControlled';
import { useDismiss } from '../utils/useDismiss';

export interface MultiSuggestLabels {
  /** Number of suggestions, announced politely while typing. */
  results: (count: number) => string;
  /** Shown in the list, and announced, when nothing matches. */
  empty: string;
  /** Names the button that removes a chosen option: `remove('Rosso')`. */
  remove: (label: string) => string;
  /** Names the list of chosen options. */
  chosen: string;
}

export const MULTI_SUGGEST_LABELS: MultiSuggestLabels = {
  results: (n) => (n === 1 ? '1 suggerimento' : `${n} suggerimenti`),
  empty: 'Nessun suggerimento',
  remove: (label) => `Rimuovi ${label}`,
  chosen: 'Scelte',
};

export interface MultiSuggestOwnProps<V extends string = string>
  extends
    Omit<InputAttributes, 'type'>,
    PartsProps<'label' | 'control' | 'list' | 'option' | 'tags' | 'tag' | 'hint' | 'error'> {
  label: ReactNode;
  hint?: ReactNode;
  /** Error message: marks the field invalid. */
  error?: ReactNode;
  options: SuggestOption<V>[];
  /** The chosen values, in the order they were chosen. */
  value?: V[];
  defaultValue?: V[];
  onValueChange?: (value: V[]) => void;
  /** Which options match the text (default: every word, any order, ignoring case and accents). */
  filter?: ((option: SuggestOption<V>, text: string) => boolean) | false;
  /** Most suggestions listed. Default 8. */
  limit?: number;
  labels?: Partial<MultiSuggestLabels>;
}

export type MultiSuggestProps<
  V extends string = string,
  E extends ElementType = 'div',
> = PolymorphicProps<E, MultiSuggestOwnProps<V>>;

const matches = (o: SuggestOption, text: string) =>
  matchesAll(o.description ? `${o.label} ${o.description}` : o.label, text);

/**
 * Suggest for several choices: the list stays open while you pick, each pick becomes a removable tag under the field,
 * Backspace in an empty field removes the last one. Submits one hidden input per value when it has a `name`.
 */
export function MultiSuggest<V extends string = string, E extends ElementType = 'div'>(
  props: MultiSuggestProps<V, E>,
) {
  const {
    as,
    css,
    className,
    label,
    hint,
    error,
    options,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    filter,
    limit = 8,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...others
  } = useThemeProps('MultiSuggest', props as unknown as MultiSuggestProps);
  const labels = { ...MULTI_SUGGEST_LABELS, ...useLabels('MultiSuggest'), ...labelsProp };
  const { input, root: rest } = splitInputProps(others);
  const { name, disabled, onKeyDown, onFocus, onBlur, ...inputRest } = input as InputAttributes;
  const [value, setValue] = useControlled<string[]>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: string[]) => void) | undefined,
  });
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-list`;
  const hintId = hint != null ? `${id}-hint` : undefined;
  const errorId = error != null && error !== false ? `${id}-error` : undefined;
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('MultiSuggest', 'root', css);
  const { part, style } = useParts('MultiSuggest', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);

  const query = text.trim();
  const found = useMemo(() => {
    const all =
      filter === false || !query ? options : options.filter((o) => (filter ?? matches)(o, query));
    return all.slice(0, Math.max(0, limit));
  }, [options, filter, query, limit]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  const dismiss = useDismiss({ ref: box, open, onDismiss: close });

  useEffect(() => {
    if (open && active >= 0)
      document.getElementById(`${listId}-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active, listId]);

  const next = (from: number, step: 1 | -1) => {
    const n = found.length;
    for (let k = 1; k <= n; k++) {
      const i = (((from + step * k) % n) + n) % n;
      if (!found[i]?.disabled) return i;
    }
    return -1;
  };

  const toggle = (o: SuggestOption) => {
    if (o.disabled) return;
    setValue(value.includes(o.value) ? value.filter((v) => v !== o.value) : [...value, o.value]);
    setText('');
  };
  const remove = (v: string) => {
    setValue(value.filter((x) => x !== v));
    document.getElementById(inputId)?.focus();
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      if (!open) {
        setOpen(true);
        setActive(next(step === 1 ? -1 : 0, step));
      } else setActive(next(active < 0 && step === -1 ? 0 : active, step));
    } else if (e.key === 'Enter' && open && active >= 0) {
      e.preventDefault();
      const o = found[active];
      if (o) toggle(o);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Backspace' && !text && value.length) {
      setValue(value.slice(0, -1));
    }
  };

  const showing = open && !disabled;
  const status =
    showing && query ? (found.length ? labels.results(found.length) : labels.empty) : '';
  const byValue = new Map(options.map((o) => [o.value as string, o]));

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-suggest slurp-multisuggest', styled.className, className)}
        data-open={showing ? '' : undefined}
        data-invalid={errorId ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...root}
      >
        {part('label', 'label', {
          id: `${id}-label`,
          htmlFor: inputId,
          className: 'slurp-suggest-label',
          children: label,
        })}
        <div ref={box} className="slurp-suggest-box" onBlur={dismiss.containerProps.onBlur}>
          <div className="slurp-suggest-surface">
            {part('control', 'input', {
              ...inputRest,
              id: inputId,
              type: 'text',
              role: 'combobox',
              className: 'slurp-suggest-control',
              disabled,
              autoComplete: inputRest.autoComplete ?? 'off',
              'aria-expanded': showing,
              'aria-controls': listId,
              'aria-autocomplete': 'list',
              'aria-activedescendant': showing && active >= 0 ? `${listId}-${active}` : undefined,
              'aria-invalid': errorId ? true : undefined,
              'aria-describedby': cx(errorId, hintId) || undefined,
              value: text,
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                setText(e.target.value);
                setOpen(true);
                setActive(-1);
              },
              onKeyDown: keys,
              onFocus,
              onBlur,
              onClick: () => {
                if (!open) setOpen(true);
              },
            })}
            <div className="slurp-suggest-clip">
              {found.length > 0 ? (
                part('list', 'ul', {
                  id: listId,
                  role: 'listbox',
                  'aria-multiselectable': true,
                  'aria-labelledby': `${id}-label`,
                  className: 'slurp-suggest-list',
                  children: found.map((o, i) => {
                    const on = value.includes(o.value);
                    return (
                      <Fragment key={o.value}>
                        {part('option', 'li', {
                          id: `${listId}-${i}`,
                          role: 'option',
                          className: 'slurp-suggest-option',
                          'aria-selected': on,
                          'aria-disabled': o.disabled || undefined,
                          'data-active': showing && i === active ? '' : undefined,
                          'data-chosen': on ? '' : undefined,
                          onMouseDown: (e: MouseEvent) => e.preventDefault(),
                          onPointerMove: () => {
                            if (!o.disabled && i !== active) setActive(i);
                          },
                          onClick: () => toggle(o),
                          children: (
                            <>
                              <span className="slurp-suggest-option-text">
                                <span className="slurp-suggest-option-label">
                                  <Mark text={o.label} query={query} />
                                </span>
                                {o.description && (
                                  <span className="slurp-suggest-option-description">
                                    <Mark text={o.description} query={query} />
                                  </span>
                                )}
                              </span>
                              {on && (
                                <span className="slurp-suggest-option-check" aria-hidden="true">
                                  <CheckIcon size={18} />
                                </span>
                              )}
                            </>
                          ),
                        })}
                      </Fragment>
                    );
                  }),
                })
              ) : (
                <p id={listId} className="slurp-suggest-empty">
                  {labels.empty}
                </p>
              )}
            </div>
          </div>
        </div>
        {value.length > 0 &&
          part('tags', 'ul', {
            'aria-label': labels.chosen,
            className: 'slurp-multisuggest-tags',
            children: value.map((v) => {
              const text = byValue.get(v)?.label ?? v;
              return (
                <li key={v}>
                  {part('tag', 'button', {
                    type: 'button',
                    className: 'slurp-multisuggest-tag',
                    disabled,
                    'aria-label': labels.remove(text),
                    onClick: () => remove(v),
                    children: (
                      <>
                        <span>{text}</span>
                        <CloseIcon size={14} aria-hidden="true" />
                      </>
                    ),
                  })}
                </li>
              );
            }),
          })}
        {hintId &&
          part('hint', 'p', { id: hintId, className: 'slurp-suggest-hint', children: hint })}
        {errorId &&
          part('error', 'p', {
            id: errorId,
            className: 'slurp-suggest-error',
            children: (
              <>
                <ErrorIcon size={16} />
                <span>{error}</span>
              </>
            ),
          })}
        <span className="slurp-visually-hidden" role="status">
          {status}
        </span>
        {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      </Root>
    </>
  );
}
