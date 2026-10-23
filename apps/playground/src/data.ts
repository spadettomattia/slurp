// Sample catalogue: sections of the entry grid, items of each list, facts of each detail page.

export interface Item {
  id: string;
  name: string;
  brand: string;
  price: number;
  score: number;
  used: boolean;
  description: string;
  facts: { label: string; value: string }[];
}

export interface Section {
  id: string;
  label: string;
  /** Tint of the section (hex). */
  color: string;
  items: Item[];
}

const BRANDS = ['Lumen', 'Orbis', 'Nadir', 'Vela', 'Quarzo', 'Pixelia'];

function items(section: string, label: string, count: number, base: number): Item[] {
  return Array.from({ length: count }, (_, i) => {
    const brand = BRANDS[i % BRANDS.length] ?? 'Lumen';
    const price = base + i * 70;
    return {
      id: `${section}-${i + 1}`,
      name: `${brand} ${label} ${i + 1}`,
      brand,
      price,
      score: Math.round((7.4 + ((i * 7) % 25) / 10) * 10) / 10,
      used: i % 3 === 2,
      description: `Pensato per durare: più autonomia, più leggero e con assistenza inclusa per due anni. La batteria si ricarica in meno di un'ora e il prezzo comprende la spedizione.`,
      facts: [
        { label: 'Prezzo', value: `${price.toLocaleString('it-IT')} €` },
        { label: 'Peso', value: `${150 + i * 20} g` },
        { label: 'Garanzia', value: '2 anni' },
      ],
    };
  });
}

export const SECTIONS: Section[] = [
  {
    id: 'phones',
    label: 'Smartphone',
    color: '#8b6fff',
    items: items('phones', 'Smartphone', 9, 299),
  },
  { id: 'laptops', label: 'Laptop', color: '#3d7bf7', items: items('laptops', 'Laptop', 6, 699) },
  { id: 'audio', label: 'Audio', color: '#ef1cac', items: items('audio', 'Cuffie', 7, 59) },
  { id: 'home', label: 'Casa', color: '#16a34a', items: items('home', 'Robot', 5, 199) },
  { id: 'games', label: 'Giochi', color: '#f97316', items: items('games', 'Console', 4, 349) },
  { id: 'photo', label: 'Foto', color: '#14b8a6', items: items('photo', 'Fotocamera', 6, 449) },
];
