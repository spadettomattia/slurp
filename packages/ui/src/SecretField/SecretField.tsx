import { EyeIcon, EyeOffIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useState, type ElementType } from 'react';

import { Bubble } from '../Bubble/Bubble';
import { Field, type FieldProps } from '../Field/Field';
import { useLabels } from '../internal/labels';
import { useThemeProps } from '../internal/styled';

export interface SecretFieldLabels {
  /** Name of the toggle (a pressed button shows the secret). */
  show: string;
}

export const SECRETFIELD_LABELS: SecretFieldLabels = { show: 'Mostra la password' };

export type SecretFieldProps<E extends ElementType = 'div'> = Omit<
  FieldProps<E>,
  'type' | 'multiline' | 'rows'
> & {
  labels?: Partial<SecretFieldLabels>;
};

interface ControlProps extends Record<string, unknown> {
  shown: boolean;
  onToggle: () => void;
  toggleLabel: string;
  className?: string;
}

/** The input plus the toggle, in place of Field's control. */
function SecretControl({ shown, onToggle, toggleLabel, className, ...input }: ControlProps) {
  return (
    <span className="slurp-secret-field-control">
      <input className={className} {...input} />
      <Bubble
        className="slurp-secret-field-toggle"
        appearance="plain"
        tone="neutral"
        size="sm"
        label={toggleLabel}
        aria-pressed={shown}
        onClick={onToggle}
      >
        {shown ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </Bubble>
    </span>
  );
}

/**
 * A password field: a Field (label, hint, error) whose secret can be shown with a pressed toggle. Password managers
 * keep working: it stays a real `type="password"` input until shown.
 */
export function SecretField<E extends ElementType = 'div'>(props: SecretFieldProps<E>) {
  const {
    labels: labelsProp,
    className,
    autoComplete = 'current-password',
    ...rest
  } = useThemeProps('SecretField', props as SecretFieldProps);
  const labels = { ...SECRETFIELD_LABELS, ...useLabels('SecretField'), ...labelsProp };
  const [shown, setShown] = useState(false);
  return (
    <Field
      {...(rest as FieldProps)}
      className={cx('slurp-secret-field', className)}
      type={shown ? 'text' : 'password'}
      autoComplete={autoComplete}
      spellCheck={false}
      parts={{ control: SecretControl }}
      partProps={{
        control: { shown, onToggle: () => setShown((s) => !s), toggleLabel: labels.show },
      }}
    />
  );
}
