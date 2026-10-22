import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  // Hoisted <style href> stay in <head>: React de-duplicates them for the whole document, like in an app.
  document.documentElement.removeAttribute('data-theme');
  try {
    window.localStorage.clear();
  } catch {
    // ignore
  }
});
