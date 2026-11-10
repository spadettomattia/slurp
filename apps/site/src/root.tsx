import '@slurp-ui/react/styles.css';
import './site.css';

import { ColorSchemeScript, createTheme, Ground, SlurpProvider } from '@slurp-ui/react';
import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';

import { COPY } from './lib/i18n';
import { langOf } from './lib/lang';

const theme = createTheme({ accent: 'hue-violet' });

export function Layout({ children }: { children: ReactNode }) {
  const lang = langOf(useLocation().pathname);
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={COPY[lang].tagline} />
        <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.svg`} type="image/svg+xml" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <SlurpProvider theme={theme}>
          <Ground />
          {children}
        </SlurpProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : String(error);
  return (
    <main className="site-error">
      <h1>Slurp UI</h1>
      <p>{message}</p>
    </main>
  );
}
