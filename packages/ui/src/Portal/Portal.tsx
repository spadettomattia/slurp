import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children?: ReactNode;
  /** Where to render (default `document.body`). */
  container?: Element | null;
}

const noop = () => () => undefined;

/** Renders children elsewhere in the document (on the client only: nothing during server rendering). */
export function Portal({ children, container }: PortalProps) {
  const client = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  if (!client) return null;
  return createPortal(children, container ?? document.body);
}
