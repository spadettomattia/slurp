import { Settings, Text } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [language, setLanguage] = useState('it');
  return (
    <div style={{ minHeight: 420 }}>
      <Settings
        inline
        languages={[
          { value: 'it', label: 'Italiano', lang: 'it' },
          { value: 'en', label: 'English', lang: 'en' },
        ]}
        language={language}
        onLanguageChange={setLanguage}
      >
        <Text font="caption" muted>
          Le schede restano in italiano.
        </Text>
      </Settings>
    </div>
  );
}
