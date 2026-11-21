import { Media } from '@slurp-ui/react';

const svg = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#7a5af8"/></svg>')}`;

export default function Basic() {
  return <Media src={svg} alt="Un rettangolo viola" ratio="4/3" caption="Una didascalia" />;
}
