import { Bubble, Surface } from '@slurp-ui/react';
import pkg from '@slurp-ui/react/package.json';
import { Link } from 'react-router';

import { REPO } from '../../site.config';
import { href, useLang } from '~/lib/lang';
import { BranchIcon } from '@slurp-ui/react/icons';
import { Logo } from './Logo';

/**
 * The identity of the site, floating like every Slurp control: the logo, the name and the version on a pill at the
 * top left (back to the home); the repository on a Bubble at the top right, beside Settings.
 */
export function Brand() {
  const { lang, copy } = useLang();
  return (
    <header className="site-top">
      <Surface as="div" level="dock" radius="full" className="site-brand">
        <Link to={href(lang, '')} className="site-brand-link" aria-label={copy.homeLink}>
          <Logo className="site-logo" />
          <span className="site-brand-name">Slurp UI</span>
        </Link>
        <a
          className="site-brand-version"
          href={`${REPO}/releases`}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.releases(pkg.version)}
        >
          v{pkg.version}
        </a>
      </Surface>
      <Bubble
        as="a"
        href={REPO}
        target="_blank"
        rel="noreferrer"
        label={copy.github}
        appearance="soft"
        tone="neutral"
        className="site-github"
      >
        <BranchIcon />
      </Bubble>
    </header>
  );
}
