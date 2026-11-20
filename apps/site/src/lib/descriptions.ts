// One line under each page's title in its section's list, in the page's language (the props stay in English).
import type { Lang } from '../../site.config';

type Text = Record<Lang, string>;
const t = (it: string, en: string): Text => ({ it, en });

export const DESCRIPTIONS: Record<string, Text> = {
  'components/button': t(
    'L’azione principale, in quattro aspetti',
    'The main action, in four appearances',
  ),
  'components/bubble': t('Bottone tondo con sola icona', 'Round icon-only button'),
  'components/chip': t(
    'Scelte e filtri che si accendono e si spengono',
    'Choices and filters that toggle',
  ),
  'components/link': t(
    'Link nel testo, riconoscibile senza colore',
    'Text link, recognisable without colour',
  ),
  'components/segmented': t(
    'Una scelta tra poche, sempre visibili',
    'One choice among a few, all visible',
  ),
  'components/field': t(
    'Campo di testo con etichetta, aiuto ed errore',
    'Text field with label, hint and error',
  ),
  'components/search': t('Ricerca con conteggio dei risultati', 'Search with a results count'),
  'components/suggest': t(
    'Campo che suggerisce mentre scrivi',
    'A field that suggests as you type',
  ),
  'components/choice': t(
    'Scelta da un elenco: il bottone diventa il pannello',
    'Pick from a list: the button becomes the panel',
  ),
  'components/checkbox': t(
    'Una casella da spuntare, anche a metà',
    'A box to tick, also half-ticked',
  ),
  'components/radio': t('Una sola scelta in un gruppo', 'One choice in a group'),
  'components/switch': t(
    'Acceso o spento, con effetto immediato',
    'On or off, with immediate effect',
  ),
  'components/range': t(
    'Un valore su una scala, con il cursore',
    'A value on a scale, with a slider',
  ),
  'components/rating': t(
    'Un voto a stelle, da dare o da leggere',
    'A star rating, to give or to read',
  ),
  'components/swatch': t('Scelta di un colore', 'Pick a colour'),
  'components/hairline': t(
    'Una linea sottile per separare i gruppi',
    'A thin line to separate groups',
  ),
  'components/skiplink': t(
    '«Vai al contenuto», il primo stop di Tab',
    '“Skip to content”, the first Tab stop',
  ),
  'components/prose': t('Testo lungo da Markdown o da un CMS', 'Long text from Markdown or a CMS'),
  'components/code': t('Blocco di codice con copia', 'Code block with copy'),
  'components/contents': t(
    'L’indice della pagina, che segue la lettura',
    'The page index, following the reading',
  ),
  'components/rail': t('Navigazione verticale a gruppi', 'Vertical navigation in groups'),
  'components/pagenav': t('Pagina precedente e successiva', 'Previous and next page'),
  'components/dialog': t(
    'Finestra modale che cresce dal bottone',
    'Modal window that grows from its button',
  ),
  'components/toast': t(
    'Conferme brevi in fondo allo schermo',
    'Short confirmations at the bottom',
  ),
  'components/menu': t(
    'Lista di azioni: il bottone diventa il pannello',
    'A list of actions: the button becomes the panel',
  ),
};
