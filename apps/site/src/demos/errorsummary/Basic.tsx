import { Button, ErrorSummary, Field, Flow } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setErrors(
          ['nome', 'email']
            .filter((id) => !data.get(id))
            .map((id) => ({
              id,
              message: id === 'nome' ? 'Scrivi il nome' : 'Scrivi un indirizzo email',
            })),
        );
      }}
    >
      <Flow gap={3}>
        <ErrorSummary errors={errors} />
        <Field id="nome" name="nome" label="Nome" />
        <Field id="email" name="email" type="email" label="Email" />
        <div>
          <Button type="submit">Invia</Button>
        </div>
      </Flow>
    </form>
  );
}
