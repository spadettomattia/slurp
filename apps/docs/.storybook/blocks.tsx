import {
  Controls,
  Description,
  Heading,
  Markdown,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks';
import anatomy from 'virtual:slurp-anatomy';

// The page of every component: demo, props, anatomy (read from its CSS), accessibility, then the other stories.

export interface SlurpDocsParameters {
  /** Notes on keyboard, roles and names, one per item (Markdown). */
  a11y?: string[];
  /** Anatomy entry when it differs from the last segment of the title. */
  anatomy?: string | string[];
  bare?: boolean;
}

function useSlurpParameters(): { names: string[]; params: SlurpDocsParameters } {
  const { preparedMeta } = useOf('meta', ['meta']);
  const params = (preparedMeta.parameters.slurp ?? {}) as SlurpDocsParameters;
  const fallback = preparedMeta.title.split('/').pop() ?? '';
  const names = params.anatomy ?? fallback;
  return { names: Array.isArray(names) ? names : [names], params };
}

const code = (s: string) => <code>{s}</code>;

/** Classes, custom properties and state attributes of the component, from its stylesheet. */
export function Anatomy() {
  const { names } = useSlurpParameters();
  const entries = names.flatMap((name) => {
    const a = anatomy[name];
    return a ? [{ name, ...a }] : [];
  });
  if (!entries.length) return null;
  return (
    <>
      <Heading>Anatomia</Heading>
      <Markdown>
        {
          'Classi stabili per i CSS dell’app, variabili da sovrascrivere (`style` o un selettore) e attributi che espongono lo stato: tutti fuori da `@layer slurp.*` vincono senza `!important`.'
        }
      </Markdown>
      {entries.map((e) => (
        <table key={e.name} className="docs-anatomy">
          {entries.length > 1 && <caption>{e.name}</caption>}
          <tbody>
            <tr>
              <th scope="row">Classi</th>
              <td>
                {e.classes.map((c) => (
                  <span key={c}>
                    {code(`.${c}`)}
                    {c === e.root && e.classes.length > 1 ? ' (radice)' : ''}{' '}
                  </span>
                ))}
              </td>
            </tr>
            {e.vars.length > 0 && (
              <tr>
                <th scope="row">Variabili</th>
                <td>
                  {e.vars.map((v) => (
                    <div key={v.name}>
                      {code(v.name)} <span className="docs-muted">= {v.value}</span>
                    </div>
                  ))}
                </td>
              </tr>
            )}
            {e.states.length > 0 && (
              <tr>
                <th scope="row">Stati</th>
                <td>
                  {e.states.map((s) => (
                    <span key={s}>{code(`[${s}]`)} </span>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ))}
    </>
  );
}

/** Keyboard, roles and accessible names: from `parameters.slurp.a11y`. */
export function Accessibility() {
  const { params } = useSlurpParameters();
  if (!params.a11y?.length) return null;
  return (
    <>
      <Heading>Accessibilità</Heading>
      <Markdown>{params.a11y.map((line) => `- ${line}`).join('\n')}</Markdown>
    </>
  );
}

export function ComponentPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <Accessibility />
      <Anatomy />
      <Stories includePrimary={false} />
    </>
  );
}
