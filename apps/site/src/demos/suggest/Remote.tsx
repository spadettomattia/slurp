import { Suggest, type SuggestOption } from '@slurp-ui/react';
import { useEffect, useState } from 'react';

const CITIES = ['Torino', 'Trento', 'Trieste', 'Taranto', 'Terni', 'Treviso', 'Trapani'];

/** Stands in for a server: answers after 300 ms. */
function search(text: string): Promise<SuggestOption[]> {
  const q = text.toLowerCase();
  const found = CITIES.filter((c) => c.toLowerCase().startsWith(q));
  return new Promise((r) => setTimeout(() => r(found.map((c) => ({ value: c, label: c }))), 300));
}

export default function Remote() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<SuggestOption[]>([]);
  useEffect(() => {
    let live = true;
    if (text.trim()) void search(text).then((o) => live && setOptions(o));
    return () => {
      live = false;
    };
  }, [text]);
  return (
    <div style={{ width: 360, minHeight: 300 }}>
      {/* filter={false}: the options are already the server's answer. */}
      <Suggest
        label="Città"
        options={options}
        filter={false}
        inputValue={text}
        onInputValueChange={setText}
      />
    </div>
  );
}
