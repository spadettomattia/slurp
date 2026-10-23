import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import '@slurp-ui/react/styles.css';

import { App } from './App';
import { GridRoute, RouterDemo, SectionRoute } from './RouterDemo';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/router',
    element: <RouterDemo />,
    children: [
      { index: true, element: <GridRoute /> },
      { path: ':sectionId', element: <SectionRoute /> },
    ],
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
