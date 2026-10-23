import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { Bubble } from '../Bubble/Bubble';
import { Button } from '../Button/Button';
import type { StatusTone } from '../Notice/Notice';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Default `neutral`: icon + text, never colour alone. */
  tone?: StatusTone;
  /** One action ("Annulla"). */
  action?: { label: string; onClick: () => void };
  /** ms before it goes away; paused while hovered or focused. `Infinity` keeps it. Default 5000. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

export interface ToastLabels {
  /** Name of the region that holds the toasts. */
  region: string;
  /** Name of each close button. */
  dismiss: string;
}

export const TOAST_LABELS: ToastLabels = { region: 'Notifiche', dismiss: 'Chiudi notifica' };

interface ToastApi {
  /** Shows a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children?: ReactNode;
  labels?: Partial<ToastLabels>;
  /** At most this many on screen; the oldest go first. Default 3. */
  limit?: number;
}

const ICONS = { neutral: InfoIcon, success: SuccessIcon, warning: WarningIcon, danger: ErrorIcon };

/**
 * Short confirmations at the bottom of the screen, above the Dock (`--slurp-toast-offset`). The list is a polite live
 * region, present from the start so new toasts are announced.
 */
export function ToastProvider({ children, labels: labelsProp, limit = 3 }: ToastProviderProps) {
  const labels = { ...TOAST_LABELS, ...labelsProp };
  const [items, setItems] = useState<ToastEntry[]>([]);
  const next = useRef(1);
  const dismiss = useCallback(
    (id: number) => setItems((all) => all.filter((t) => t.id !== id)),
    [],
  );
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = next.current++;
      setItems((all) => [...all, { ...options, id }].slice(-limit));
      return id;
    },
    [limit],
  );
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <ToastContext value={api}>
      {children}
      <section className="slurp-toasts" aria-label={labels.region}>
        <ol aria-live="polite" aria-relevant="additions text" className="slurp-toasts-list">
          {items.map((t) => (
            <ToastItem
              key={t.id}
              entry={t}
              onDismiss={() => dismiss(t.id)}
              dismissLabel={labels.dismiss}
            />
          ))}
        </ol>
      </section>
    </ToastContext>
  );
}

function ToastItem({
  entry,
  onDismiss,
  dismissLabel,
}: {
  entry: ToastEntry;
  onDismiss: () => void;
  dismissLabel: string;
}) {
  const { title, description, tone = 'neutral', action, duration = 5000 } = entry;
  const [paused, setPaused] = useState(false);
  const left = useRef(duration);
  const latest = useRef(onDismiss);
  useEffect(() => {
    latest.current = onDismiss;
  });

  useEffect(() => {
    if (paused || !Number.isFinite(left.current)) return;
    const started = Date.now();
    const t = setTimeout(() => latest.current(), left.current);
    return () => {
      clearTimeout(t);
      left.current -= Date.now() - started;
    };
  }, [paused]);

  const Icon = ICONS[tone];
  return (
    <li
      className="slurp-toast"
      data-tone={tone}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <span className="slurp-toast-icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <div className="slurp-toast-text">
        <p className="slurp-toast-title">{title}</p>
        {description != null && <p className="slurp-toast-description">{description}</p>}
      </div>
      {action && (
        <Button
          appearance="plain"
          size="sm"
          onClick={() => {
            action.onClick();
            onDismiss();
          }}
        >
          {action.label}
        </Button>
      )}
      <Bubble
        label={dismissLabel}
        size="sm"
        className={cx('slurp-toast-dismiss')}
        onClick={onDismiss}
      >
        <CloseIcon size={18} />
      </Bubble>
    </li>
  );
}

/** `toast(options)` and `dismiss(id)`, from the nearest ToastProvider. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('Slurp: useToast() needs a <ToastProvider> above it.');
  return api;
}
