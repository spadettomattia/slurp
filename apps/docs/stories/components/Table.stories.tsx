import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating, Table, type TableColumn } from '@slurp-ui/react';

interface Phone {
  name: string;
  brand: string;
  screen: number;
  rating: number;
  price: number;
}

const rows: Phone[] = [
  { name: 'iPhone 17', brand: 'Apple', screen: 6.3, rating: 4.6, price: 979 },
  { name: 'Pixel 10', brand: 'Google', screen: 6.3, rating: 4.4, price: 899 },
  { name: 'Galaxy S26', brand: 'Samsung', screen: 6.2, rating: 4.3, price: 929 },
  { name: 'Fairphone 6', brand: 'Fairphone', screen: 6.3, rating: 4.1, price: 599 },
  { name: 'Xperia 1 VII', brand: 'Sony', screen: 6.5, rating: 4.0, price: 1499 },
];

const price = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const columns: TableColumn<Phone>[] = [
  { key: 'name', header: 'Modello', rowHeader: true, sortable: true },
  { key: 'brand', header: 'Marca', sortable: true },
  {
    key: 'screen',
    header: 'Schermo',
    align: 'end',
    sortable: true,
    cell: (r) => `${r.screen.toLocaleString('it-IT')}″`,
  },
  {
    key: 'rating',
    header: 'Voto',
    sortable: true,
    cell: (r) => <Rating label={r.name} value={r.rating} readOnly size="sm" />,
  },
  {
    key: 'price',
    header: 'Prezzo',
    align: 'end',
    sortable: true,
    cell: (r) => price.format(r.price),
  },
];

const meta = {
  title: 'Componenti/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    caption: 'Smartphone a confronto',
    columns,
    rows,
    defaultSort: { key: 'price', direction: 'ascending' },
  },
  argTypes: { columns: { control: false }, rows: { control: false }, rowKey: { control: false } },
  parameters: {
    slurp: {
      a11y: [
        'Una vera `<table>` con `caption`; la prima colonna nomina le righe (`th scope="row"`). Se è più larga dello schermo scorre dentro una regione con nome, raggiungibile con Tab.',
        'Le intestazioni ordinabili sono bottoni; la colonna ordinata ha `aria-sort` e la freccia, le altre l’icona a due frecce.',
        'I numeri sono allineati a destra con cifre tabulari; con `hideCaption` il titolo resta solo per i lettori di schermo.',
      ],
    },
  },
} satisfies Meta<typeof Table<Phone>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Empty: Story = { args: { rows: [] } };
