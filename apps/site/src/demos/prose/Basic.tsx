import { Prose } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Prose css={{ maxWidth: 520 }}>
      <h2>Titolo della sezione</h2>
      <p>
        Un paragrafo con un <a href="#prose">link</a>, del testo <strong>in evidenza</strong> e del{' '}
        <code>codice</code>.
      </p>
      <ul>
        <li>Primo punto</li>
        <li>Secondo punto</li>
      </ul>
      <blockquote>
        <p>Una citazione, distinta dal resto.</p>
      </blockquote>
    </Prose>
  );
}
