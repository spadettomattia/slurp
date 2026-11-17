import { Button, Choice, Flow, Text } from '@slurp-ui/react';
import { useState, type FormEvent } from 'react';

export default function Form() {
  const [sent, setSent] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(String(new FormData(e.currentTarget).get('language')));
  };
  return (
    <form onSubmit={submit} style={{ minHeight: 280 }}>
      <Flow gap={4} align="flex-start">
        {/* With name, a hidden input carries the value in the form. */}
        <Choice
          label="Lingua"
          name="language"
          defaultValue="it"
          options={[
            { value: 'it', label: 'Italiano' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
        />
        <Button type="submit" appearance="soft">
          Salva
        </Button>
        {sent && <Text font="caption">language = {sent}</Text>}
      </Flow>
    </form>
  );
}
