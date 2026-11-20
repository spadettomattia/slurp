import { CheckIcon, CopyIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { Bubble } from '../Bubble/Bubble';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useClipboard } from '../utils/useClipboard';

export interface CodeLabels {
  /** Name of the copy button. */
  copy: string;
  /** Its name for two seconds after a copy. */
  copied: string;
  /** Name of the scrollable code region when there is no filename. */
  region: string;
}

export const CODE_LABELS: CodeLabels = {
  copy: 'Copia il codice',
  copied: 'Copiato',
  region: 'Codice',
};

export interface CodeOwnProps extends PartsProps<'bar' | 'filename' | 'copy' | 'pre'> {
  /** The code as text: shown as is, and what Copy puts on the clipboard. */
  code?: string;
  /**
   * The same code already highlighted (HTML from shiki, Prism…). Shown instead of `code`; `code` is still what gets
   * copied (or the text of this markup when there is no `code`).
   */
  html?: string;
  /** Your own markup inside <code>, instead of `code` or `html`. */
  children?: ReactNode;
  /** A file name or a label above the code ("main.tsx", "Terminale"). */
  filename?: ReactNode;
  /** Language, for the record (`data-language`) and for highlighters. */
  language?: string;
  /** Show the copy button. Default true. */
  copyable?: boolean;
  labels?: Partial<CodeLabels>;
}

export type CodeProps<E extends ElementType = 'figure'> = PolymorphicProps<E, CodeOwnProps>;

/**
 * A block of code: an optional file name, a copy button that says when it worked, and a region that scrolls on its
 * own (reachable with Tab). Highlighting is yours to bring: pass `html` from any highlighter; its colours map onto
 * the design system through `--slurp-code-*` (shiki's CSS variables are mapped too).
 */
export function Code<E extends ElementType = 'figure'>(props: CodeProps<E>) {
  const {
    as,
    css,
    className,
    code,
    html,
    children,
    filename,
    language,
    copyable = true,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Code', props as CodeProps);
  const labels = { ...CODE_LABELS, ...useLabels('Code'), ...labelsProp };
  const Root = (as ?? 'figure') as ElementType;
  const styled = useCss('Code', 'root', css);
  const { part, style } = useParts('Code', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const { copy, copied } = useClipboard();
  const bodyId = useId();
  const regionName = typeof filename === 'string' ? filename : (language ?? labels.region);

  const content =
    children ??
    (html != null ? <code dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>);

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-code', styled.className, className)}
        data-language={language}
        {...root}
      >
        {(filename != null || copyable) &&
          part('bar', 'div', {
            className: 'slurp-code-bar',
            children: (
              <>
                {part('filename', 'span', {
                  className: 'slurp-code-filename',
                  children: filename,
                })}
                {copyable &&
                  part('copy', Bubble, {
                    className: 'slurp-code-copy',
                    size: 'sm',
                    label: copied ? labels.copied : labels.copy,
                    'data-copied': copied || undefined,
                    onClick: () =>
                      void copy(code ?? document.getElementById(bodyId)?.textContent ?? ''),
                    children: copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />,
                  })}
              </>
            ),
          })}
        {part('pre', 'pre', {
          id: bodyId,
          className: 'slurp-code-pre',
          tabIndex: 0,
          role: 'region',
          'aria-label': regionName,
          children: content,
        })}
        {copyable && (
          <span className="slurp-visually-hidden" role="status">
            {copied ? labels.copied : ''}
          </span>
        )}
      </Root>
    </>
  );
}
