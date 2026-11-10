import {
  ListRow,
  Tile,
  type ListRowProps,
  type SlurpNavigateOptions,
  type TileProps,
} from '@slurp-ui/react';

import { useLinkProps } from '~/lib/link';

/** A Tile of the home grid that opens a section. */
export function TileLink({
  to,
  slurp,
  ...props
}: Omit<TileProps<'a'>, 'as' | 'href' | 'onClick'> & { to: string; slurp?: SlurpNavigateOptions }) {
  return <Tile {...props} as="a" {...useLinkProps(to, slurp)} />;
}

/** A row of a section's list; its trailing link ("Apri") opens the page. */
export function RowLink({
  to,
  slurp,
  ...props
}: Omit<ListRowProps, 'href' | 'partProps'> & { to: string; slurp?: SlurpNavigateOptions }) {
  const { href, onClick } = useLinkProps(to, slurp);
  return <ListRow {...props} href={href} partProps={{ action: { onClick } }} />;
}
