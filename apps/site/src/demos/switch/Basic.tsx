import { Flow, Switch } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow gap={3}>
      <Switch defaultChecked>Notifiche</Switch>
      <Switch>Modalità compatta</Switch>
      <Switch disabled>Backup automatico</Switch>
    </Flow>
  );
}
