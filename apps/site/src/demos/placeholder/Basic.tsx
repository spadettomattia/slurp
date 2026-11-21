import { Flow, Placeholder } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow direction="row" gap={3} align="center">
      <Placeholder shape="circle" width={44} height={44} />
      <Placeholder shape="capsule" width={160} height={16} />
      <Placeholder shape="square" width={64} height={64} />
    </Flow>
  );
}
