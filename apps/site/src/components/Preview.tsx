import {
  Bubble,
  Button,
  Checkbox,
  Chip,
  Code,
  Contents,
  Hairline,
  Link,
  Radio,
  RadioGroup,
  Rail,
  Range,
  Rating,
  Search,
  Segmented,
  Swatch,
  Switch,
} from '@slurp-ui/react';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, SuccessIcon } from '@slurp-ui/react/icons';
import type { ReactNode } from 'react';

/** A small live piece of each documented component, for its row in the list (inert: looked at, not used). */
const PREVIEWS: Record<string, () => ReactNode> = {
  'components/button': () => <Button size="sm">Continua</Button>,
  'components/bubble': () => (
    <Bubble label="Aggiungi" appearance="soft">
      <PlusIcon />
    </Bubble>
  ),
  'components/chip': () => <Chip selected>Recenti</Chip>,
  'components/link': () => <Link href="#preview">Leggi di più</Link>,
  'components/segmented': () => (
    <Segmented
      label="Vista"
      size="sm"
      defaultValue="grid"
      options={[
        { value: 'grid', label: 'Griglia' },
        { value: 'list', label: 'Lista' },
      ]}
    />
  ),
  'components/field': () => <span className="site-preview-field">Nome</span>,
  'components/search': () => <Search labels={{ placeholder: 'Cerca…' }} />,
  'components/suggest': () => <span className="site-preview-field">Paese…</span>,
  'components/choice': () => <span className="site-preview-field site-preview-choice">Scegli</span>,
  'components/checkbox': () => <Checkbox defaultChecked>Ricordami</Checkbox>,
  'components/radio': () => (
    <RadioGroup label="Scelta" defaultValue="a" orientation="horizontal">
      <Radio value="a">Sì</Radio>
      <Radio value="b">No</Radio>
    </RadioGroup>
  ),
  'components/switch': () => <Switch defaultChecked>Attivo</Switch>,
  'components/range': () => <Range label="Intensità" defaultValue={60} />,
  'components/rating': () => <Rating label="Voto" value={4} readOnly size="sm" />,
  'components/swatch': () => <Swatch color="#1aa594" label="Verde acqua" selected />,
  'components/hairline': () => <Hairline css={{ width: 120 }} />,
  'components/skiplink': () => <span className="site-preview-skip">Vai al contenuto</span>,
  'components/prose': () => (
    <span className="site-preview-prose">
      <b>Titolo</b>
      <span>Un paragrafo di testo…</span>
    </span>
  ),
  'components/code': () => <Code code="npm i" copyable={false} />,
  'components/contents': () => (
    <Contents
      hideTitle
      active="a"
      items={[
        { id: 'a', label: 'Uso' },
        { id: 'b', label: 'Esempi' },
      ]}
    />
  ),
  'components/rail': () => (
    <Rail label="Anteprima">
      <Rail.Group>
        <Rail.Link href="#a" current>
          Profilo
        </Rail.Link>
      </Rail.Group>
    </Rail>
  ),
  'components/pagenav': () => (
    <Button appearance="soft" tone="neutral" size="sm" endIcon={<ChevronRightIcon />}>
      Successiva
    </Button>
  ),
  'components/dialog': () => (
    <Button appearance="outline" tone="neutral" size="sm">
      Apri
    </Button>
  ),
  'components/toast': () => (
    <span className="site-preview-toast">
      <SuccessIcon size={18} />
      Salvato
    </span>
  ),
  'components/menu': () => (
    <Button appearance="soft" size="sm" endIcon={<ChevronDownIcon />}>
      Azioni
    </Button>
  ),
};

export function hasPreview(slug: string) {
  return slug in PREVIEWS;
}

/** The preview of a page, inert and hidden from assistive tech (the row's title names it). */
export function Preview({ slug }: { slug: string }) {
  const render = PREVIEWS[slug];
  if (!render) return null;
  return (
    <span className="site-preview" aria-hidden="true" inert>
      {render()}
    </span>
  );
}
