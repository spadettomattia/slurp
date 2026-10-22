import type { HueToken } from '@slurp-ui/react/tokens';

export interface Section {
  id: string;
  label: string;
  hue: HueToken;
  items: number;
}

export const SECTIONS: Section[] = [
  { id: 'phones', label: 'Smartphone', hue: 'violet', items: 8 },
  { id: 'laptops', label: 'Laptop', hue: 'blue', items: 6 },
  { id: 'audio', label: 'Audio', hue: 'pink', items: 7 },
  { id: 'home', label: 'Casa', hue: 'green', items: 9 },
  { id: 'games', label: 'Giochi', hue: 'orange', items: 5 },
  { id: 'photo', label: 'Foto', hue: 'teal', items: 6 },
];
