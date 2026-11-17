import { Checkbox, Flow } from '@slurp-ui/react';
import { useState } from 'react';

const ITEMS = ['Commenti', 'Menzioni', 'Promemoria'];

export default function Indeterminate() {
  const [on, setOn] = useState<string[]>(['Menzioni']);
  const all = on.length === ITEMS.length;
  return (
    <Flow gap={2}>
      <Checkbox
        checked={all}
        indeterminate={on.length > 0 && !all}
        onCheckedChange={(c) => setOn(c ? ITEMS : [])}
      >
        Tutte le notifiche
      </Checkbox>
      <Flow gap={2} style={{ paddingLeft: 32 }}>
        {ITEMS.map((item) => (
          <Checkbox
            key={item}
            checked={on.includes(item)}
            onCheckedChange={(c) =>
              setOn((now) => (c ? [...now, item] : now.filter((x) => x !== item)))
            }
          >
            {item}
          </Checkbox>
        ))}
      </Flow>
    </Flow>
  );
}
