import { Footer } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Footer>
      <Footer.Group title="Documentazione">
        <Footer.Link href="#guide">Guide</Footer.Link>
        <Footer.Link href="#api">API</Footer.Link>
      </Footer.Group>
      <Footer.Group title="Progetto">
        <Footer.Link href="#releases">Note di rilascio</Footer.Link>
        <Footer.Link href="#license">Licenza</Footer.Link>
      </Footer.Group>
      <Footer.Bottom>© 2026 Nome. Tutti i diritti riservati.</Footer.Bottom>
    </Footer>
  );
}
