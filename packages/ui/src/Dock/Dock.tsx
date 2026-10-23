import { ArrowDownIcon, ArrowLeftIcon, SearchIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import { CRUMB_TAN, crumbPath, type CrumbEnd } from '../lib/crumb';
import type { PolymorphicProps } from '../lib/polymorphic';
import { focusFirst, moveFocus } from '../utils/focus';
import { useControlled } from '../utils/useControlled';
import { useDismiss } from '../utils/useDismiss';
import { useForkRef } from '../utils/useForkRef';
import { COMPACT_QUERY, useMediaQuery } from '../utils/useMediaQuery';

export interface DockLabels {
  /** Name of the navigation landmark. */
  navigation: string;
  /** Name of the breadcrumb list. */
  crumbs: string;
  /** Name of the back button. */
  back: string;
  /** Name of the search field and of the phone search action. */
  search: string;
  /** Placeholder: say where it looks ("Cerca in Smartphone…"). */
  searchPlaceholder: string;
  /** Find in page with no match. */
  noResults: string;
  /** Spoken count of find in page. */
  matches: (index: number, count: number) => string;
  /** Name of the "2/5" counter button. */
  nextMatch: (index: number, count: number) => string;
  /** How to move into results from the field. */
  resultsHint: string;
}

export const DOCK_LABELS: DockLabels = {
  navigation: 'Navigazione',
  crumbs: 'Percorso',
  back: 'Indietro',
  search: 'Cerca',
  searchPlaceholder: 'Cerca…',
  noResults: 'Nessun risultato',
  matches: (i, n) => `${n === 1 ? '1 corrispondenza' : `${n} corrispondenze`}, ${i} di ${n}`,
  nextMatch: (i, n) => `Vai alla prossima corrispondenza: ${i} di ${n}`,
  resultsHint: 'Freccia giù per scorrere i risultati, Esc per chiuderli.',
};

interface DockContextValue {
  compact: boolean;
  labels: DockLabels;
  panelId: string;
  panelInner: HTMLElement | null;
  /** The panel shows results (ArrowDown moves into them from the field). */
  hasPanel: boolean;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchInput: RefObject<HTMLInputElement | null>;
  focusResults: () => boolean;
}

const DockContext = createContext<DockContextValue | null>(null);

function useDock(name: string) {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error(`Slurp: <${name}> goes inside a <Dock>.`);
  return ctx;
}

export interface DockOwnProps {
  /** The bar's content: Dock.Crumbs, Dock.Search, Dock.Actions. */
  children?: ReactNode;
  /** Content of the panel above the bar (menu, filters, results). The panel grows in height while it is set. */
  panel?: ReactNode;
  /** Name of the panel region ("Filtri"). */
  panelLabel?: string;
  /**
   * Move focus into the panel when it opens (menus and filters: yes; results while typing: no). Default true.
   */
  focusPanel?: boolean;
  /** A press outside, Escape or Tab out: close your panel here. */
  onDismiss?: () => void;
  /** In the flow (previews, docs) instead of fixed at the bottom. */
  inline?: boolean;
  labels?: Partial<DockLabels>;
}

export type DockProps<E extends ElementType = 'nav'> = PolymorphicProps<E, DockOwnProps>;

/**
 * The single place to navigate, floating at the bottom: the path as a breadcrumb (back first, then each level), search
 * and actions. One boundary: the bar. Panels (menu, filters, results) grow above it in height; they close on a press
 * outside, Escape or Tab out. On phones earlier crumbs show their icon and search becomes an action.
 */
function DockRoot<E extends ElementType = 'nav'>(props: DockProps<E>) {
  const {
    as,
    css,
    className,
    children,
    panel,
    panelLabel,
    focusPanel = true,
    onDismiss,
    inline = false,
    labels: labelsProp,
    ...rest
  } = useThemeProps('Dock', props as DockProps);
  const labels = { ...DOCK_LABELS, ...labelsProp };
  const compact = useMediaQuery(COMPACT_QUERY);
  const [searchOpen, setSearchOpen] = useState(false);
  const [panelInner, setPanelInner] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const panelId = `${useId()}-panel`;
  const searching = compact && searchOpen;
  const shown = searching ? null : panel;
  const open = searching || (panel != null && panel !== false);
  const Root = (as ?? 'nav') as ElementType;
  const styled = useCss('Dock', 'root', css);
  const root = useAnimationRoot(rest);

  const dismiss = useDismiss({
    ref: bar,
    open,
    onDismiss: () => {
      setSearchOpen(false);
      if (panel != null) onDismiss?.();
    },
    fallbackFocus: () => searchInput.current,
  });

  const { opened } = dismiss;

  // Menus and filters take focus when they open: the panel sits before the bar, Tab would never reach it.
  const hadPanel = useRef(false);
  useEffect(() => {
    const has = shown != null && shown !== false;
    if (has && !hadPanel.current && focusPanel) {
      // Escape gives focus back to the control that opened the panel.
      if (document.activeElement instanceof HTMLElement) opened(document.activeElement);
      focusFirst(panelRef.current);
    }
    hadPanel.current = has;
  }, [shown, focusPanel, opened]);

  const focusResults = () => !!moveFocusFirst(panelRef.current);

  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-dock-wrap', styled.className, className)}
        data-inline={inline || undefined}
        aria-label={labels.navigation}
        {...root}
      >
        <div
          ref={bar}
          className="slurp-dock"
          onKeyDown={dismiss.containerProps.onKeyDown}
          onBlur={dismiss.containerProps.onBlur}
        >
          <div
            ref={panelRef}
            id={panelId}
            className="slurp-dock-panel"
            data-open={open || undefined}
            role={open ? 'region' : undefined}
            aria-label={open ? (searching ? labels.search : panelLabel) : undefined}
            inert={!open}
            onKeyDown={(e) =>
              moveFocus(e, panelRef.current, '[data-result]', () => searchInput.current?.focus())
            }
          >
            <div ref={setPanelInner} className="slurp-dock-panel-inner">
              {shown}
            </div>
          </div>
          <DockContext
            value={{
              compact,
              labels,
              panelId,
              panelInner,
              hasPanel: shown != null && shown !== false,
              searchOpen: searching,
              setSearchOpen,
              searchInput,
              focusResults,
            }}
          >
            <div className="slurp-dock-row">{children}</div>
          </DockContext>
        </div>
      </Root>
    </>
  );
}

function moveFocusFirst(root: HTMLElement | null) {
  const first = root?.querySelector<HTMLElement>('[data-result]');
  first?.focus();
  return first;
}

// ---------- Crumbs ----------

const CrumbPlace = createContext<{ first: boolean; last: boolean }>({ first: true, last: true });

export interface DockCrumbsProps {
  children?: ReactNode;
  /** Name of the list; default `labels.crumbs`. */
  label?: string;
}

/** The path: Dock.Back first, then a Dock.Crumb per level, the current one last. */
function DockCrumbs({ children, label }: DockCrumbsProps) {
  const { labels } = useDock('Dock.Crumbs');
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <ol className="slurp-dock-crumbs" aria-label={label ?? labels.crumbs}>
      {items.map((child, i) => (
        <CrumbPlace key={child.key ?? i} value={{ first: i === 0, last: i === items.length - 1 }}>
          <li>{child}</li>
        </CrumbPlace>
      ))}
    </ol>
  );
}

type CrumbShapeProps = {
  left: CrumbEnd;
  right: CrumbEnd;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

/** A crumb button that draws its own shape: it measures itself and renders one SVG path. */
function CrumbShape({ left, right, className, children, ref, ...rest }: CrumbShapeProps) {
  const own = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const merged = useForkRef(ref as never, own);
  useLayoutEffect(() => {
    const el = own.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () =>
      setSize((s) =>
        s && s.w === el.offsetWidth && s.h === el.offsetHeight
          ? s
          : { w: el.offsetWidth, h: el.offsetHeight },
      );
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const s = size ? size.h * CRUMB_TAN : 0;
  return (
    <button
      ref={merged}
      type="button"
      className={cx('slurp-crumb', className)}
      data-drawn={size ? '' : undefined}
      data-left={left}
      data-right={right}
      {...rest}
    >
      {size && size.w > 0 && (
        <svg
          className="slurp-crumb-shape"
          aria-hidden="true"
          width={size.w + s}
          height={size.h}
          viewBox={`0 0 ${size.w + s} ${size.h}`}
          style={{ left: -s / 2 }}
        >
          <path d={crumbPath(size.w, size.h, left, right)} />
        </svg>
      )}
      {children}
    </button>
  );
}

export type DockBackProps<E extends ElementType = 'button'> = PolymorphicProps<
  E,
  { label?: string }
>;

/** The back button: the first crumb (the root), round on the left. */
function DockBack<E extends ElementType = 'button'>(props: DockBackProps<E>) {
  const { label, className, css: _css, ...rest } = props as DockBackProps;
  const { labels } = useDock('Dock.Back');
  const { last } = useContext(CrumbPlace);
  const root = useAnimationRoot(rest);
  return (
    <CrumbShape
      left="round"
      right={last ? 'round' : 'slant'}
      className={cx('slurp-crumb-back', className)}
      aria-label={label ?? labels.back}
      data-crumb="0"
      {...root}
    >
      <ArrowLeftIcon />
    </CrumbShape>
  );
}

export interface DockCrumbOwnProps {
  /** The level's name. */
  children: ReactNode;
  /** The page you are on: accent-filled, `aria-current="page"`. */
  current?: boolean;
  /** Shown instead of the label on phones when this crumb is not the current one (the label stays as its name). */
  icon?: ReactNode;
  /** The crumb opens a panel (the section menu): its open state, shown by an arrow and aria-expanded. */
  expanded?: boolean;
}

export type DockCrumbProps<E extends ElementType = 'button'> = PolymorphicProps<
  E,
  DockCrumbOwnProps
>;

/** A level of the path. Every crumb triggers the transition: give it an animationId. */
function DockCrumb<E extends ElementType = 'button'>(props: DockCrumbProps<E>) {
  const {
    children,
    current = false,
    icon,
    expanded,
    className,
    css: _css,
    ...rest
  } = props as DockCrumbProps;
  const { compact, panelId } = useDock('Dock.Crumb');
  const { first, last } = useContext(CrumbPlace);
  const root = useAnimationRoot(rest);
  const iconOnly = compact && !current && icon != null;
  const name = typeof children === 'string' ? children : undefined;
  return (
    <CrumbShape
      left={first ? 'round' : 'slant'}
      right={last ? 'round' : 'slant'}
      className={className}
      data-current={current || undefined}
      data-icon={iconOnly || undefined}
      aria-current={current ? 'page' : undefined}
      aria-label={iconOnly ? name : undefined}
      title={iconOnly ? name : undefined}
      aria-expanded={expanded}
      aria-controls={expanded !== undefined ? panelId : undefined}
      {...root}
    >
      {iconOnly ? (
        <span className="slurp-crumb-icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span className="slurp-crumb-label">{children}</span>
      )}
      {expanded !== undefined && (
        <span className="slurp-crumb-arrow" data-up={expanded || undefined} aria-hidden="true">
          <ArrowDownIcon size={16} />
        </span>
      )}
    </CrumbShape>
  );
}

// ---------- Search ----------

export interface DockSearchProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Name of the field; default `labels.search`. */
  label?: string;
  /** Default `labels.searchPlaceholder`: say where it looks. */
  placeholder?: string;
  /** Enter, when this is not find in page. */
  onSearch?: (value: string) => void;
  /** Find in page: how many matches (shows "2/5" or "Nessun risultato"). */
  count?: number;
  /** Find in page: the active match, 0-based. */
  index?: number;
  /** Find in page: Enter / Shift+Enter / a tap on the counter. */
  onStep?: (delta: 1 | -1) => void;
}

/** The one search field, scoped by context. On phones it is an action that opens the field in the panel. */
function DockSearch({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  label,
  placeholder,
  onSearch,
  count,
  index = 0,
  onStep,
}: DockSearchProps) {
  const ctx = useDock('Dock.Search');
  const { labels } = ctx;
  const [value, setValue] = useControlled({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const name = label ?? labels.search;
  const typed = value.trim() !== '';

  const counter =
    count != null && typed ? (
      <>
        {count ? (
          <button
            type="button"
            className="slurp-dock-search-count"
            aria-label={labels.nextMatch(index + 1, count)}
            onClick={(e) => {
              e.preventDefault();
              onStep?.(1);
            }}
          >
            {index + 1}/{count}
          </button>
        ) : (
          <span className="slurp-dock-search-count" data-empty="" aria-hidden="true">
            {labels.noResults}
          </span>
        )}
        <span className="slurp-visually-hidden" role="status">
          {count ? labels.matches(index + 1, count) : labels.noResults}
        </span>
      </>
    ) : null;

  const field = (inPanel: boolean) => (
    <label className="slurp-dock-search">
      <SearchIcon size={18} />
      <span className="slurp-visually-hidden">{name}</span>
      <input
        ref={ctx.searchInput}
        type="search"
        value={value}
        placeholder={placeholder ?? labels.searchPlaceholder}
        enterKeyHint={onStep ? 'next' : 'search'}
        autoComplete="off"
        autoFocus={inPanel}
        aria-controls={ctx.hasPanel ? ctx.panelId : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (onStep) onStep(e.shiftKey ? -1 : 1);
            else onSearch?.(value);
          } else if (e.key === 'ArrowDown' && ctx.hasPanel && ctx.focusResults()) {
            e.preventDefault();
          }
        }}
      />
      {counter}
    </label>
  );

  if (!ctx.compact) return field(false);
  return (
    <>
      <DockAction
        label={typed ? `${name}: “${value.trim()}”` : name}
        expanded={ctx.searchOpen}
        dot={typed && !ctx.searchOpen}
        onClick={() => ctx.setSearchOpen(!ctx.searchOpen)}
      >
        <SearchIcon />
      </DockAction>
      {ctx.searchOpen && ctx.panelInner && createPortal(field(true), ctx.panelInner)}
    </>
  );
}

// ---------- Actions ----------

/** Actions at the right end of the bar (search before filters). */
function DockActions({ children }: { children?: ReactNode }) {
  return <div className="slurp-dock-actions">{children}</div>;
}

export interface DockActionOwnProps {
  /** Accessible name ("Filtri"); the count is added to it. */
  label: string;
  /** The icon. */
  children: ReactNode;
  /** Its panel is open: accent fill and aria-expanded. */
  expanded?: boolean;
  /** Badge count (active filters). */
  count?: number;
  /** How the count is said; default `${n} attivi`. */
  countLabel?: (count: number) => string;
  /** A small accent dot (a query is active while the search panel is closed). */
  dot?: boolean;
}

export type DockActionProps<E extends ElementType = 'button'> = PolymorphicProps<
  E,
  DockActionOwnProps
>;

/** Round 48px action of the bar (filters, the phone search). */
function DockAction<E extends ElementType = 'button'>(props: DockActionProps<E>) {
  const {
    label,
    children,
    expanded,
    count,
    countLabel = (n) => (n === 1 ? '1 attivo' : `${n} attivi`),
    dot,
    className,
    css: _css,
    onClick,
    ...rest
  } = props as DockActionProps;
  const { panelId } = useDock('Dock.Action');
  const root = useAnimationRoot(rest);
  return (
    <button
      type="button"
      className={cx('slurp-dock-action', className)}
      data-active={expanded || undefined}
      aria-label={count ? `${label}, ${countLabel(count)}` : label}
      aria-expanded={expanded}
      aria-controls={expanded !== undefined ? panelId : undefined}
      onClick={onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined}
      {...root}
    >
      <span aria-hidden="true" className="slurp-dock-action-icon">
        {children}
      </span>
      {count ? (
        <span className="slurp-dock-action-count" aria-hidden="true">
          {count}
        </span>
      ) : null}
      {dot ? <span className="slurp-dock-action-dot" aria-hidden="true" /> : null}
    </button>
  );
}

type DockComponent = typeof DockRoot & {
  Crumbs: typeof DockCrumbs;
  Back: typeof DockBack;
  Crumb: typeof DockCrumb;
  Search: typeof DockSearch;
  Actions: typeof DockActions;
  Action: typeof DockAction;
};

export const Dock = Object.assign(DockRoot, {
  Crumbs: DockCrumbs,
  Back: DockBack,
  Crumb: DockCrumb,
  Search: DockSearch,
  Actions: DockActions,
  Action: DockAction,
}) as DockComponent;

export { DockAction, DockActions, DockBack, DockCrumb, DockCrumbs, DockSearch };
