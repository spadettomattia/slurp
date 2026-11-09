import { CheckIcon, ErrorIcon } from '@slurp-ui/icons';
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
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { splitInputProps, type InputAttributes } from '../Field/Field';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import { matchesAll } from '../lib/layout';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { Mark } from '../Mark/Mark';
import { useControlled } from '../utils/useControlled';
import { useDismiss } from '../utils/useDismiss';

export interface SuggestOption<V extends string = string> {
  value: V;
  /** Text of the option, written into the field when chosen. */
  label: string;
  /** A second line (a brand, a category); also searched. */
  description?: string;
  disabled?: boolean;
}

export interface SuggestLabels {
  /** Number of suggestions, announced politely while typing. */
  results: (count: number) => string;
  /** Shown in the list, and announced, when nothing matches. */
  empty: string;
}

export const SUGGEST_LABELS: SuggestLabels = {
  results: (n) => (n === 1 ? '1 suggerimento' : `${n} suggerimenti`),
  empty: 'Nessun suggerimento',
};

export interface SuggestOwnProps<V extends string = string>
  extends
    Omit<InputAttributes, 'type'>,
    PartsProps<'label' | 'control' | 'list' | 'option' | 'hint' | 'error'> {
  /** Visible label. */
  label: ReactNode;
  hint?: ReactNode;
  /** Error message: marks the field invalid. */
  error?: ReactNode;
  options: SuggestOption<V>[];
  /** The chosen option; null while the text matches none. */
  value?: V | null;
  defaultValue?: V | null;
  onValueChange?: (value: V | null) => void;
  /** The text in the field. */
  inputValue?: string;
  /** Default the label of the chosen option, else empty. */
  defaultInputValue?: string;
  onInputValueChange?: (text: string) => void;
  /**
   * Which options match the text. Default: every word of the text, in any order, ignoring case and accents, in the
   * label or the description. `false` when the app already filters `options` (results from a server).
   */
  filter?: ((option: SuggestOption<V>, text: string) => boolean) | false;
  /** Most suggestions listed. Default 8. */
  limit?: number;
  /** Lists the suggestions as soon as the field takes focus. Default false (they show while typing). */
  openOnFocus?: boolean;
  labels?: Partial<SuggestLabels>;
}

export type SuggestProps<
  V extends string = string,
  E extends ElementType = 'div',
> = PolymorphicProps<E, SuggestOwnProps<V>>;

const matches = (o: SuggestOption, text: string) =>
  matchesAll(o.description ? `${o.label} ${o.description}` : o.label, text);

/**
 * Text field with suggestions (combobox): the field **becomes** the list, growing downward on one surface. Focus
 * stays in the field: arrows move through the suggestions, Enter chooses, Escape closes (then clears); matches are
 * marked in the options.
 */
export function Suggest<V extends string = string, E extends ElementType = 'div'>(
  props: SuggestProps<V, E>,
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
    defaultValue = null,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    filter,
    limit = 8,
    openOnFocus = false,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...others
  } = useThemeProps('Suggest', props as unknown as SuggestProps);
  const labels = { ...SUGGEST_LABELS, ...labelsProp };
  const { input, root: rest } = splitInputProps(others);
  const { name, disabled, onKeyDown, onFocus, onBlur, ...inputRest } = input as InputAttributes;
  const [value, setValue] = useControlled<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: string | null) => void) | undefined,
  });
  const [text, setText] = useControlled({
    value: inputValue,
    defaultValue:
      defaultInputValue ??
      options.find((o) => o.value === (valueProp ?? defaultValue))?.label ??
      '',
    onChange: onInputValueChange,
  });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-list`;
  const hintId = hint != null ? `${id}-hint` : undefined;
  const errorId = error != null && error !== false ? `${id}-error` : undefined;
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Suggest', 'root', css);
  const { part, style } = useParts('Suggest', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);

  const chosen = options.find((o) => o.value === value);
  // With the chosen option's own text in the field, every option is offered again.
  const query = chosen && text === chosen.label ? '' : text.trim();
  const found = useMemo(() => {
    const all =
      filter === false || !query ? options : options.filter((o) => (filter ?? matches)(o, query));
    return all.slice(0, Math.max(0, limit));
  }, [options, filter, query, limit]);
  // While the list closes it keeps the suggestions it showed, so they shrink away instead of changing.
  const [listed, setListed] = useState(found);
  if (open && listed !== found) setListed(found);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  const dismiss = useDismiss({ ref: box, open, onDismiss: close });

  useEffect(() => {
    if (open && active >= 0)
      document.getElementById(`${listId}-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active, listId]);

  /** Next enabled suggestion from `from` in direction `step`, wrapping; -1 when none. */
  const next = (from: number, step: 1 | -1) => {
    const n = found.length;
    for (let k = 1; k <= n; k++) {
      const i = (((from + step * k) % n) + n) % n;
      if (!found[i]?.disabled) return i;
    }
    return -1;
  };

  const choose = (o: SuggestOption) => {
    if (o.disabled) return;
    if (o.value !== value) setValue(o.value);
    if (o.label !== text) setText(o.label);
    close();
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      if (!open) {
        setOpen(true);
        const at = found.findIndex((o) => o.value === value);
        setActive(e.altKey ? -1 : at >= 0 ? at : next(step === 1 ? -1 : 0, step));
      } else setActive(next(active < 0 && step === -1 ? 0 : active, step));
    } else if (e.key === 'Enter' && open && active >= 0) {
      e.preventDefault();
      const o = found[active];
      if (o) choose(o);
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (text) {
        e.preventDefault();
        setText('');
        if (value != null) setValue(null);
      }
    }
  };

  const showing = open && !disabled;
  const status =
    showing && query ? (found.length ? labels.results(found.length) : labels.empty) : '';

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-suggest', styled.className, className)}
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
                const v = e.target.value;
                setText(v);
                if (value != null && v !== chosen?.label) setValue(null);
                setOpen(true);
                setActive(-1);
              },
              onKeyDown: keys,
              onFocus: (e: FocusEvent<HTMLInputElement>) => {
                onFocus?.(e);
                if (openOnFocus) setOpen(true);
              },
              onBlur,
              onClick: () => {
                if (!open) setOpen(true);
              },
            })}
            <div className="slurp-suggest-clip">
              {listed.length > 0 ? (
                part('list', 'ul', {
                  id: listId,
                  role: 'listbox',
                  'aria-labelledby': `${id}-label`,
                  className: 'slurp-suggest-list',
                  children: listed.map((o, i) => (
                    <Fragment key={o.value}>
                      {part('option', 'li', {
                        id: `${listId}-${i}`,
                        role: 'option',
                        className: 'slurp-suggest-option',
                        'aria-selected': showing && i === active,
                        'aria-disabled': o.disabled || undefined,
                        'data-chosen': o.value === value ? '' : undefined,
                        // Keep focus in the field.
                        onMouseDown: (e: MouseEvent) => e.preventDefault(),
                        onPointerMove: () => {
                          if (!o.disabled && i !== active) setActive(i);
                        },
                        onClick: () => choose(o),
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
                            {o.value === value && (
                              <span className="slurp-suggest-option-check" aria-hidden="true">
                                <CheckIcon size={18} />
                              </span>
                            )}
                          </>
                        ),
                      })}
                    </Fragment>
                  )),
                })
              ) : (
                <p id={listId} className="slurp-suggest-empty">
                  {labels.empty}
                </p>
              )}
            </div>
          </div>
        </div>
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
        {name && <input type="hidden" name={name} value={value ?? ''} />}
      </Root>
    </>
  );
}
