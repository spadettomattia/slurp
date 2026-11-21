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
  'components/accentscope': t(
    'Dà a una parte della pagina un altro colore d’accento, ricavato da un colore qualunque',
    'Gives part of the page another accent colour, derived from any colour',
  ),
  'components/avatar': t(
    'Una persona (o un marchio): foto tonda, e le iniziali quando manca o non si carica',
    'A person (or a brand): a round photo, and initials when it is missing or fails to load',
  ),
  'components/avatargroup': t(
    'Avatar sovrapposti per le persone di un gruppo, con un contatore “+N” per le altre',
    'Overlapping avatars for the people of a group, with a “+N” counter for the others',
  ),
  'components/bento': t(
    'La griglia d’ingresso a dodici colonne: le tile prendono più o meno spazio secondo il loro peso',
    'The twelve-column entry grid: tiles take more or less room by weight',
  ),
  'components/bloom': t(
    'Un bottone che diventa il suo pannello: cresce in larghezza e altezza su una sola superficie e',
    'A button that becomes its panel: it grows in width and height on a single surface and turns back',
  ),
  'components/calendar': t(
    'La griglia di un mese, usabile da sola: un giorno o un periodo, con limiti e giorni spenti',
    'A month grid, usable on its own: a day or a period, with limits and disabled days',
  ),
  'components/card': t(
    'Una scheda di contenuto: un’immagine o un fondo del colore, un titolo, una descrizione e un valore',
    'A content card: an image or a ground in the colour, a title, a description and a value',
  ),
  'components/carousel': t(
    'Una fila di elementi che scorrono uno alla volta, con precedente, successivo e punti',
    'A row of items that scroll one at a time, with previous, next and dots',
  ),
  'components/cell': t(
    'Il mattone di base: qualunque elemento, stilizzato con css',
    'The base primitive: any element, styled with css',
  ),
  'components/compare': t(
    'Due immagini nello stesso riquadro con un divisore che scorre dall’una all’altra: prima e dopo',
    'Two pictures in the same frame with a divider that sweeps between them: before and after',
  ),
  'components/consent': t(
    'Un banner di consenso fissato in basso: accettare e rifiutare hanno lo stesso peso',
    'A consent banner fixed to the bottom: accepting and rejecting have the same weight',
  ),
  'components/count': t(
    'Un numero in un cerchio per ciò che è nuovo o da leggere',
    'A number in a circle for what is new or unread',
  ),
  'components/datefield': t(
    'Un campo data che si apre in un calendario',
    'A date field that opens into a calendar: the day (or period) is written in words',
  ),
  'components/dock': t(
    'La barra flottante in basso che porta tutta la navigazione: briciole, ricerca e azioni',
    'The floating bar at the bottom that carries all navigation: crumbs, search and actions',
  ),
  'components/empty': t(
    'Il momento in cui non c’è nulla da mostrare: un titolo, una spiegazione e un solo modo per uscirne',
    'The moment when there is nothing to show: a title, an explanation and a single way out',
  ),
  'components/errorsummary': t(
    'L’elenco degli errori di un modulo, in cima',
    'The list of a form’s errors, at the top: it announces the problem',
  ),
  'components/fact': t(
    'Una caratteristica in una pillola: etichetta e valore, come “Schermo 6,3″”',
    'A feature in a pill: label and value, like “Screen 6.3″”',
  ),
  'components/filedrop': t(
    'Un’area per scegliere o trascinare file, con l’elenco di quelli scelti e il modo di toglierli',
    'An area to choose or drag files, with the list of those chosen and a way to remove them',
  ),
  'components/filters': t(
    'Il pannello dei filtri: gruppi di chip con un nome e “Azzera filtri”',
    'The filters panel: groups of chips with a name and “Clear filters”',
  ),
  'components/flow': t(
    'Una fila o una colonna con spazio uniforme tra i figli: la riga di pulsanti, la pila di campi',
    'A row or column with even spacing between children: the row of buttons, the stack of fields',
  ),
  'components/fold': t(
    'Una sezione che si apre e si chiude: un titolo che è un bottone e una regione che cresce in altezza',
    'A section that opens and closes: a heading that is a button and a region that grows in height',
  ),
  'components/footer': t(
    'Il piede del sito: colonne di link e una riga finale per legale, versione e lingua',
    'The foot of a site: columns of links and a bottom line for legal, version and language',
  ),
  'components/frame': t(
    'La colonna centrale della pagina: larghezza massima 1280px, margini di 24px (16px sui telefoni)',
    'The page’s central column: maximum width 1280px, 24px gutters (16px on phones)',
  ),
  'components/ground': t(
    'La base della pagina, da usare una volta alla radice: sfondo, tipografia e anello di focus',
    'The page baseline, to use once at the root: background, typography and focus ring',
  ),
  'components/hint': t(
    'Un suggerimento breve che compare vicino a un controllo, al passaggio o al focus',
    'A short hint that appears near a control, on hover or focus',
  ),
  'components/kbd': t(
    'Un tasto della tastiera nel testo: “Premi Esc per chiudere”',
    'A keyboard key in the text: “Press Esc to close”',
  ),
  'components/lightbox': t(
    'Un’immagine a grandezza piena in un modale, con la galleria da sfogliare',
    'A picture at full size in a modal, with the gallery to browse',
  ),
  'components/listrow': t(
    'Una riga di lista con titolo, nota, valore e un’azione',
    'A list row with title, note, value and an action',
  ),
  'components/mark': t(
    'Evidenzia nel testo le parole che corrispondono a una ricerca, ignorando maiuscole e accenti',
    'Highlights the words in a text that match a search, ignoring case and accents',
  ),
  'components/media': t(
    'Un’immagine con le sue proporzioni riservate',
    'An image with its proportions reserved: the page does not jump while it loads',
  ),
  'components/multisuggest': t(
    'Suggest per più scelte: la lista resta aperta mentre scegli e ogni scelta diventa un tag che si',
    'Suggest for several choices: the list stays open while you pick and each choice becomes a tag you',
  ),
  'components/notice': t(
    'Un messaggio che resta nella pagina: informazione',
    'A message that stays on the page: information, success, warning or error, with a title and a text',
  ),
  'components/numberfield': t(
    'Un campo numerico con − e + da 44px: si usa con i tasti',
    'A number field with 44px − and + buttons',
  ),
  'components/pages': t(
    'La paginazione: pagina corrente, vicine e estremi, con precedente e successiva',
    'Pagination: the current page, neighbours and ends, with previous and next',
  ),
  'components/pinfield': t(
    'Un codice a poche cifre (verifica, accesso) mostrato a caselle ma gestito da un solo campo',
    'A short code (verification, sign-in) shown as boxes but handled by a single field',
  ),
  'components/placeholder': t(
    'Il segnaposto di un contenuto che sta arrivando',
    'The stand-in for content that is arriving: a round, capsule or square shape, the size it will have',
  ),
  'components/portal': t(
    'Disegna i figli in un altro punto del documento (di base alla fine del body)',
    'Renders the children somewhere else in the document (by default at the end of the body)',
  ),
  'components/progress': t(
    'Quanto è fatto: una barra o un anello, con un nome e, se serve, il valore scritto',
    'How much is done: a bar or a ring, with a name and, if needed, the value written out',
  ),
  'components/quote': t(
    'Una citazione con chi la dice: un <blockquote> dentro una <figure>, con l’autore e il ruolo',
    'A quotation with who says it: a <blockquote> inside a <figure>, with the author and role',
  ),
  'components/resultrow': t(
    'Un risultato di ricerca: titolo, categoria e valore su una riga intera che si preme',
    'A search result: title, category and value on a whole pressable row',
  ),
  'components/reveal': t(
    'Una frase grande le cui parole si accendono una alla volta mentre scorri',
    'A large sentence whose words light up one at a time as you scroll',
  ),
  'components/rise': t(
    'Rivela ciò che avvolge quando scorre in vista: sale di 32px e appare in 650ms, una volta',
    'Reveals what it wraps when it scrolls into view: it rises 32px and fades in over 650ms, once',
  ),
  'components/score': t(
    'Un punteggio in un anello: l’arco pieno e la cifra scritta al centro',
    'A score in a ring: the filled arc and the written figure in the centre',
  ),
  'components/secretfield': t(
    'Un campo per password e codici segreti con un bottone che mostra o nasconde il valore',
    'A field for passwords and secret codes with a button that shows or hides the value',
  ),
  'components/settings': t(
    'Il bottone tondo in alto a destra che diventa il pannello delle impostazioni',
    'The round button at the top right that becomes the settings panel',
  ),
  'components/sheet': t(
    'Un pannello modale che sale dal bordo in basso (a tutta larghezza sui telefoni) o scorre da un lato',
    'A modal panel that rises from the bottom edge (full width on phones) or slides in from a side',
  ),
  'components/shelf': t(
    'Una fila di schede che si dispone da sola: colonne di almeno 220px che riempiono lo spazio',
    'A row of cards that arranges itself: columns of at least 220px that fill the space',
  ),
  'components/stage': t(
    'Il fondale per un’immagine o un dato: un alone e un anello nel colore, dietro il contenuto',
    'The backdrop for an image or a figure: a glow and a ring in the colour, behind the content',
  ),
  'components/steps': t(
    'I passaggi di un percorso: fatti, corrente e da fare, in orizzontale o in verticale',
    'The steps of a path: done, current and to do, horizontal or vertical',
  ),
  'components/surface': t(
    'Una superficie traslucida con angoli arrotondati e una sola ombra',
    'A translucent surface with rounded corners and a single shadow: the panel the content sits on',
  ),
  'components/table': t(
    'Una tabella di dati senza cornice: linee tra le righe',
    'A data table without a frame: lines between rows',
  ),
  'components/tabs': t(
    'Pannelli alternati con una riga di schede',
    'Alternating panels with a row of tabs: only one visible',
  ),
  'components/tag': t(
    'Un’etichetta statica per uno stato o una categoria: “Nuovo”, “Bozza”, “Verificato”',
    'A static label for a state or category: “New”, “Draft”, “Verified”',
  ),
  'components/text': t(
    'Il testo con gli stili del design system: un nome di carattere, un tono e, se serve, attenuato',
    'Text with the design system’s styles: a type style name, a tone and, if needed, muted',
  ),
  'components/tile': t(
    'Il pezzo d’ingresso della griglia: un titolo grande su un fondo del colore della sezione',
    'The grid’s entry piece: a large title on a ground in the section’s colour, with a slowly moving blob',
  ),
  'components/timeline': t(
    'Una lista verticale di eventi in ordine, uniti da una linea',
    'A vertical list of events in order, joined by a line: a history, an order, a roadmap',
  ),
  'components/tree': t(
    'Una lista annidata (file, categorie) con un solo punto di tabulazione e tutta la tastiera',
    'A nested list (files, categories) with a single tab stop and full keyboard support',
  ),
  'components/visuallyhidden': t(
    'Testo nascosto alla vista ma letto dai lettori di schermo',
    'Text hidden from view but read by screen readers',
  ),
  'customization/color': t(
    "L'interfaccia non ha un colore fisso: l'accento viene dal contenuto",
    'The interface has no fixed colour: the accent comes from the content',
  ),
  'customization/css-prop': t(
    'Ogni componente accetta css: uno stile per quella sola istanza',
    'Every component accepts css: a style for that one instance, written with the design system’s tokens',
  ),
  'customization/css-variables': t(
    'Tutto lo stile della libreria è CSS normale, con nomi che puoi usare',
    'All of the library’s styling is plain CSS, with names you can use',
  ),
  'customization/dark-mode': t(
    'Il tema scuro segue prefers-color-scheme, oppure data-theme="light" o "dark" su un elemento',
    'The dark theme follows prefers-color-scheme, or data-theme="light" or "dark" on an element',
  ),
  'customization/labels': t(
    'Ogni componente ha i suoi testi (nomi accessibili, conteggi, messaggi) in italiano',
    'Every component has its own texts (accessible names, counts, messages) in Italian',
  ),
  'customization/theme': t(
    'Un tema cambia tutta la libreria da un punto solo',
    'A theme changes the whole library from one place',
  ),
  'customization/tokens': t(
    'I token sono i valori del design system: colori in chiaro e scuro',
    'Tokens are the design system’s values: colours in light and dark',
  ),
  'hooks/panels': t(
    'Le regole dei pannelli flottanti (il menu del Dock',
    'The rules of floating panels (the Dock’s menu',
  ),
  'hooks/search': t(
    'La ricerca dentro una pagina ha tre pezzi: confrontare, evidenziare e muoversi tra le corrispondenze',
    'Searching inside a page has three pieces: matching, highlighting and moving between matches',
  ),
  'hooks/state': t('## useControlled', '## useControlled'),
  'motion/collapse-expand': t(
    'La transizione che dà il nome a Slurp: per andare avanti n elementi si fondono in uno',
    'The transition that gives Slurp its name',
  ),
  'motion/routes': t(
    'La transizione può attraversare due pagine',
    'The transition can cross two pages: it starts from the home tile and lands in the next page’s Dock',
  ),
  'components/timefield': t(
    'Un orario: l’input time del browser, vestito da Field',
    'A time of day: the browser’s time input, dressed as a Field',
  ),
  'components/focustrap': t(
    'Tiene Tab dentro un contenitore: dall’ultimo controllo si va al primo',
    'Keeps Tab inside a container: from the last control it goes to the first',
  ),
  'components/blobs': t(
    'Macchie di colore che si muovono piano dietro il contenuto',
    'Patches of colour that drift slowly behind the content',
  ),
  'components/slurpprovider': t(
    'Il punto da cui parte tutto: porta il tema',
    'Where everything starts: it carries the theme',
  ),
};
