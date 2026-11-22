import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import AppRoutes from '@/app/AppRoutes';
import '@/assets/styles/tokens.css';
import '@/assets/styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>,
);
