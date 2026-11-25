import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { addLocale, PrimeReactProvider } from 'primereact/api';

import ru from 'primelocale/ru.json';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import AppRoutes from '@/app/AppRoutes';
import '@/assets/styles/tokens.css';
import '@/assets/styles/global.css';

addLocale('ru', ru.ru);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <PrimeReactProvider value={{ locale: 'ru' }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>,
);
