import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';

import { useLabels } from '../internal/labels';
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
  /** Dismissed: it plays its way out, then leaves the list. */
  leaving?: boolean;
}

/** Longest way out (ms): the removal never waits longer, even when no transition runs. */
const LEAVE_MS = 320;

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
  const labels = { ...TOAST_LABELS, ...useLabels('Toast'), ...labelsProp };
  const [items, setItems] = useState<ToastEntry[]>([]);
  const next = useRef(1);
  const remove = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);
  // Dismissing marks the toast as leaving; it removes itself once its exit has played.
  const dismiss = useCallback(
    (id: number) => setItems((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t))),
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
              onLeft={() => remove(t.id)}
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
  onLeft,
  dismissLabel,
}: {
  entry: ToastEntry;
  onDismiss: () => void;
  onLeft: () => void;
  dismissLabel: string;
}) {
  const { title, description, tone = 'neutral', action, duration = 5000, leaving } = entry;
  const item = useRef<HTMLLIElement>(null);
  const left = useRef(duration);
  const latest = useRef(onDismiss);
  const gone = useRef(onLeft);
  useEffect(() => {
    latest.current = onDismiss;
    gone.current = onLeft;
  });

  // The way out: fix the height, then let CSS fade it and close the gap (data-leaving); remove it afterwards.
  useLayoutEffect(() => {
    const el = item.current;
    if (!leaving || !el) return;
    // From a fixed height, so it can transition to 0 (height: auto cannot).
    el.style.height = `${el.offsetHeight}px`;
    void el.offsetHeight;
    el.dataset.leaving = '';
    el.style.removeProperty('height');
    const t = setTimeout(() => gone.current(), LEAVE_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  const [paused, setPaused] = useState(false);

  // Swipe sideways to dismiss: it follows the finger 1:1; past 80px, or fast enough, it goes on its way; else it returns.
  const drag = useRef<{ x: number; t: number; dx: number } | null>(null);
  const SWIPE = 80;
  const FLICK = 0.11;
  const onDown = (e: PointerEvent<HTMLLIElement>) => {
    if (e.button !== 0 || leaving) return;
    if ((e.target as HTMLElement).closest('button, a, input, [role="button"]')) return;
    drag.current = { x: e.clientX, t: e.timeStamp, dx: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.setAttribute('data-dragging', '');
    setPaused(true);
  };
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = e.clientX - d.x;
    e.currentTarget.style.transform = `translateX(${d.dx}px)`;
    e.currentTarget.style.opacity = String(Math.max(0.3, 1 - Math.abs(d.dx) / 240));
  };
  const onUp = (e: PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    drag.current = null;
    const el = e.currentTarget;
    if (!d) return;
    el.removeAttribute('data-dragging');
    const velocity = Math.abs(d.dx) / Math.max(1, e.timeStamp - d.t);
    const away =
      e.type === 'pointerup' &&
      (Math.abs(d.dx) > SWIPE || (velocity > FLICK && Math.abs(d.dx) > 10));
    if (away) el.style.setProperty('--slurp-toast-out', d.dx > 0 ? '120%' : '-120%');
    el.style.removeProperty('transform');
    el.style.removeProperty('opacity');
    if (away) onDismiss();
    else setPaused(false);
  };

  useEffect(() => {
    if (leaving || paused || !Number.isFinite(left.current)) return;
    const started = Date.now();
    const t = setTimeout(() => latest.current(), left.current);
    return () => {
      clearTimeout(t);
      left.current -= Date.now() - started;
    };
  }, [paused, leaving]);

  const Icon = ICONS[tone];
  return (
    <li
      ref={item}
      className="slurp-toast"
      data-tone={tone}
      inert={leaving || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        if (!drag.current) setPaused(false);
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
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
