import { Fold, Text } from '@slurp-ui/react';
import { Link } from 'react-router';

import { AVAILABLE } from '~/lib/available';
import { inline } from '~/lib/inline';
import { href, useLang } from '~/lib/lang';

/**
 * The frequent questions, as a section of the home: the intro at the left (a label, the title, a line), the Fold list
 * filling the rest of the width.
 */
export function Faq() {
  const { lang, copy } = useLang();
  const f = copy.footer;
  return (
    <div className="site-faq">
      <div className="site-faq-intro">
        <p className="site-eyebrow">{f.faqEyebrow}</p>
        <Text font="title-xl" as="h2" id="faq-title">
          {f.faqTitle}
        </Text>
        <Text font="body-l" muted>
          {f.faqLead}
        </Text>
      </div>
      <div className="site-faq-list">
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
      </div>
    </div>
  );
}
