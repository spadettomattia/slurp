import { Fold, Footer } from '@slurp-ui/react';
import { Link } from 'react-router';

import { REPO } from '../../site.config';
import { href, useLang } from '~/lib/lang';
import { AVAILABLE } from '~/lib/available';
import { inline } from '~/lib/inline';

/**
 * The foot of every page: the frequent questions (Fold), the sections and project links (Footer) and the copyright.
 * Only the library's own components; links to pages that exist.
 */
export function SiteFooter() {
  const { lang, copy } = useLang();
  const f = copy.footer;
  return (
    <div className="site-footer">
      <section className="site-faq" aria-labelledby="site-faq-title">
        <h2 id="site-faq-title" className="site-faq-title">
          {f.faqTitle}
        </h2>
        {f.faq.map((item) => (
          <Fold key={item.q} summary={item.q} headingLevel={3}>
            <p className="site-faq-answer">
              {inline(item.a)}
              {item.to && AVAILABLE.has(`${lang}/${item.to}`) && (
                <>
                  {' '}
                  <Link className="slurp-link" to={href(lang, item.to)}>
                    {copy.open}
                  </Link>
                </>
              )}
            </p>
          </Fold>
        ))}
      </section>
      <Footer aria-label={f.label}>
        <Footer.Group title={f.docs}>
          <Footer.Link as={Link} to={href(lang, 'getting-started')}>
            {lang === 'it' ? 'Per iniziare' : 'Getting started'}
          </Footer.Link>
          <Footer.Link as={Link} to={href(lang, 'components')}>
            {lang === 'it' ? 'Componenti' : 'Components'}
          </Footer.Link>
          <Footer.Link as={Link} to={href(lang, 'customization')}>
            {lang === 'it' ? 'Personalizzazione' : 'Customisation'}
          </Footer.Link>
          <Footer.Link as={Link} to={href(lang, 'api')}>
            API
          </Footer.Link>
        </Footer.Group>
        <Footer.Group title={f.project}>
          <Footer.Link href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </Footer.Link>
          <Footer.Link href={`${REPO}/releases`} target="_blank" rel="noreferrer">
            {f.releases}
          </Footer.Link>
          <Footer.Link href={`${REPO}/issues`} target="_blank" rel="noreferrer">
            {f.issues}
          </Footer.Link>
          <Footer.Link href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            {f.license}
          </Footer.Link>
        </Footer.Group>
        <Footer.Bottom>
          <span>{f.rights(new Date().getFullYear())}</span>
        </Footer.Bottom>
      </Footer>
    </div>
  );
}
